package main

import (
	"bytes"
	"context"
	"encoding/binary"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/HyperloopUPV-H8/hil-gui/backend/models"

	"github.com/HyperloopUPV-H8/hil-gui/backend/conversions"

	"github.com/gorilla/websocket"
	trace "github.com/rs/zerolog/log"
)

type BackendMessage struct {
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"`
}

type Id uint16

type HilHandler struct {
	frontConn *websocket.Conn
	hilConn   *websocket.Conn
	decoders  map[Id]Decoder
}

const VehicleStateId = 1

var hilDecorders map[Id]Decoder = map[Id]Decoder{
	VehicleStateId: vehicleStateDecoder{},
}

func NewHilHandler() HilHandler {
	return HilHandler{
		decoders: hilDecorders,
	}
}

func (hilHandler *HilHandler) SetFrontConn(conn *websocket.Conn) {
	conn.SetCloseHandler(func(code int, text string) error {
		trace.Warn().Msg("Frontend disconnected")
		hilHandler.frontConn = nil
		return nil
	})

	hilHandler.frontConn = conn
}

func (hilHandler *HilHandler) SetHilConn(conn *websocket.Conn) {
	conn.SetCloseHandler(func(code int, text string) error {
		trace.Warn().Msg("Hil disconnected")
		hilHandler.hilConn = nil
		return nil
	})

	hilHandler.hilConn = conn
}

func (hilHandler *HilHandler) StartIDLE() {
	trace.Info().Msg("IDLE")
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	for {
		_, buf, err := hilHandler.frontConn.ReadMessage()
		if err != nil {
			trace.Error().Err(err).Msg("error receiving message in IDLE")
			cancel()
			continue
		}

		msg, err := hilHandler.parseFrontMessage(buf)

		if err != nil {
			trace.Error().Err(err).Msg("parsing message")
			continue
		}

		switch msg.(type) {
		case StartSimulationFront:
			err := hilHandler.notifyHilStartSimulation()
			if err != nil {
				trace.Error().Err(err).Msg("notifiying HIL to start simulation")
				cancel()
				break
			}

			err = hilHandler.startSimulationState(ctx)
			if err == nil {
				trace.Info().Msg("IDLE")

			} else if err != nil {
				return
			}
		default:
			trace.Warn().Type("unrecognized msg type", msg)
		}

	}
}

func (hilHandler *HilHandler) notifyHilStartSimulation() error {
	errStarting := hilHandler.hilConn.WriteMessage(websocket.BinaryMessage, StartSimulationFront{}.Encode())
	if errStarting != nil {
		trace.Error().Err(errStarting).Msg("Error sending message of starting simultaion to HIL")
		return errStarting
	}

	return nil
}

func (hilHandler *HilHandler) startSimulationState(ctx context.Context) error {
	errChan := make(chan error)
	dataChan := make(chan models.VehicleState)
	orderChan := make(chan models.Order)
	stopChan := make(chan struct{})
	trace.Info().Msg("Simulation state")

	simCtx, cancel := context.WithCancel(ctx)

	go hilHandler.startListeningData(dataChan, errChan, simCtx)
	go hilHandler.startSendingData(dataChan, errChan, simCtx)
	go hilHandler.startListeningOrders(orderChan, errChan, stopChan, simCtx)
	go hilHandler.startSendingOrders(orderChan, errChan, simCtx)

	for {
		select {
		case err := <-errChan:
			cancel()
			return err
		case <-stopChan:
			cancel()
			return nil
		default:
			time.Sleep(time.Millisecond * 100) // To avoid spinning loop
		}
	}
}

func (hilHandler *HilHandler) startSendingData(dataChan <-chan models.VehicleState, errChan chan<- error, ctx context.Context) {
	for {
		select {
		case <-ctx.Done():
			return
		case data := <-dataChan:
			err := hilHandler.frontConn.WriteJSON(data)
			if err != nil {
				trace.Error().Err(err).Msg("Error marshalling")
				errChan <- err
				return
			}
		default:
		}

	}
}

func (hilHandler *HilHandler) startListeningOrders(orderChan chan<- models.Order, errChan chan<- error, stopChan chan<- struct{}, ctx context.Context) {
	for {
		select {
		case <-ctx.Done():
			return
		default:
			_, buf, errReadJSON := hilHandler.frontConn.ReadMessage()
			if errReadJSON != nil {
				trace.Error().Err(errReadJSON).Msg("Error reading message from frontend")
			}
			msg, err := hilHandler.parseFrontMessage(buf)

			if err != nil {
				trace.Error().Err(err)
				errChan <- err
				//FIXME: Return?
				continue
			}

			switch typedMsg := msg.(type) {
			case FinishSimulationFront:
				trace.Info().Msg("Finish simulation")
				err := hilHandler.hilConn.WriteMessage(websocket.BinaryMessage, FinishSimulationFront{}.Encode())
				if err != nil {
					trace.Error().Err(err).Msg("Error sending finish simulation to HIL")
					errChan <- err
				}

				stopChan <- struct{}{}
				return
			case StartSimulationFront:
				trace.Warn().Msg("simulation already initializated")
			case models.ControlOrder:
				orderChan <- typedMsg
			default:
				trace.Warn().Msg("front message not recognized")
			}

			//if errReadJSON != nil || stringMsg == FinishSimulation {
			// if errReadJSON != nil {
			// 	trace.Error().Err(errReadJSON).Msg("Error reading message from frontend")
			// }

			// // trace.Info().Msg("Finish simulation")
			// // errStoping := hilHandler.hilConn.WriteMessage(websocket.BinaryMessage, FinishSimulationHil{}.Encode())
			// // if errStoping != nil {
			// // 	trace.Error().Err(errStoping).Msg("Error sending finish simulation to HIL")
			// // 	errChan <- errStoping
			// // }

			// if errReadJSON != nil {
			// 	errChan <- errReadJSON
			// } else {
			// 	stopChan <- struct{}{}
			// }
			//return
			//} else
			// if !addOrderToChan(msg, orderChan) {
			// 	trace.Warn().Msg("It is not an order")
			// }

		}

	}
}

func (hilHandler *HilHandler) startListeningData(dataChan chan<- models.VehicleState, errChan chan<- error, ctx context.Context) {
	for {
		select {
		case <-ctx.Done():
			return
		default:
			_, buf, err := hilHandler.hilConn.ReadMessage()
			if err != nil {
				trace.Error().Err(err).Msg("Error reading message from HIL")
				errChan <- err
				break
			}

			msg, err := hilHandler.parseHilMessage(buf)

			if err != nil {
				trace.Error().Err(err)
				continue
			}

			switch typedMsg := msg.(type) {
			case models.VehicleState:
				dataChan <- typedMsg
			case FinishSimulationHil:
				return
			default:
				trace.Error().Msg(fmt.Sprintf("hil message doesn't match with any type: %t", msg))
			}

		}

	}
}

func (hilHandler *HilHandler) parseHilMessage(msg []byte) (any, error) {
	if string(msg) == FinishSimulationHilMsg {
		return FinishSimulationHil{}, nil
	}

	id := getId(msg)
	decoder, ok := hilHandler.decoders[id]

	if !ok {
		return nil, fmt.Errorf("no decoder for id %d", id)
	}

	data, err := decoder.Decode(bytes.NewReader(msg))

	if err != nil {
		return nil, err
	}

	return data, nil
}

func (hilHandler *HilHandler) parseFrontMessage(msg []byte) (any, error) {
	// if string(msg) == StartSimulationMsg {
	// 	return StartSimulationFront{}, nil
	// } else {
	// 	return nil, errors.New("unrecognized front message")
	// }
	var backendMessage BackendMessage
	err := json.Unmarshal(msg, &backendMessage)
	if err != nil {
		return nil, errors.New("error unmarshalling front message")
	}

	switch backendMessage.Type {
	case "control_order":
		var controlOrder models.ControlOrder
		err := json.Unmarshal(backendMessage.Payload, &controlOrder)
		if err != nil {
			return nil, errors.New("error unmarshalling front control order")
		}
		return controlOrder, nil
	case "start_simulation":
		return StartSimulationFront{}, nil
	case "finish_simulation":
		return FinishSimulationFront{}, nil
	default:
		return nil, errors.New("unrecognized front message")
	}

	// switch string(msg) {
	// case StartSimulationMsg:
	// 	return StartSimulationFront{}, nil
	// case FinishSimulationFrontMsg:
	// 	return FinishSimulationFront{}, nil
	// default:
	// 	return nil, errors.New("unrecognized front message")
	// }
}

func getId(msg []byte) Id {
	return Id(binary.BigEndian.Uint16(msg))
}

func (hilHandler *HilHandler) startSendingOrders(orderChan <-chan models.Order, errChan chan<- error, ctx context.Context) {
	for {
		select {
		case <-ctx.Done():
			return
		case order := <-orderChan:
			encodedOrder := order.Bytes()
			errMarshal := hilHandler.hilConn.WriteMessage(websocket.BinaryMessage, encodedOrder)
			if errMarshal != nil {
				trace.Error().Err(errMarshal).Msg("Error unmarshalling order")
				errChan <- errMarshal
				return
			}
		default:
			time.Sleep(time.Millisecond * 100) // To avoid spinning loop
		}

	}
}

func prepareFormOrder(msg []byte, orderChan chan<- models.Order) error {
	var orders models.FormData = models.FormData{}
	errJSON := json.Unmarshal(msg, &orders)
	if errJSON != nil {
		trace.Error().Err(errJSON).Msg("Error unmarshalling Form Data")
		return errJSON
	}
	formOrders := conversions.ConvertFormDataToOrders(orders)
	for _, formOrder := range formOrders {
		orderChan <- formOrder
	}
	return nil
}

// func addOrderToChan(msg []byte, orderChan chan<- models.Order) bool {
// 	stringMsg := string(msg)
// 	if strings.HasPrefix(stringMsg, "{\"id\":") {
// 		var order models.ControlOrder = models.ControlOrder{}
// 		errJSON := json.Unmarshal(msg, &order)
// 		if errJSON != nil {
// 			trace.Error().Err(errJSON).Msg("Error unmarshalling Control Order")
// 			return true
// 		}
// 		orderChan <- order
// 	} else if strings.HasPrefix(stringMsg, "[{\"id\":") {
// 		errJSON := prepareFormOrder(msg, orderChan)
// 		if errJSON != nil {
// 			trace.Error().Err(errJSON).Msg("Error unmarshalling Form Data")
// 			return true
// 		}
// 	} else {
// 		return false
// 	}
// 	return true

// }

func (hilHandler *HilHandler) AreConnectionsReady() bool {
	return hilHandler.frontConn != nil && hilHandler.hilConn != nil
}
