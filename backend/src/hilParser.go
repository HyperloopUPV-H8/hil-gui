package main

import (
	"encoding/binary"
	"errors"

	"github.com/HyperloopUPV-H8/hil-gui/backend/conversions"
	"github.com/HyperloopUPV-H8/hil-gui/backend/models"

	trace "github.com/rs/zerolog/log"
)

const FrontOrderId = 2
const ControlOrderId = 3

func Encode(data interface{}) []byte {
	switch dataType := data.(type) {
	case []models.VehicleState:
		head := make([]byte, 2)
		binary.LittleEndian.PutUint16(head, VehicleStateId)
		return Prepend(conversions.GetAllBytesFromVehiclesState(dataType), head...)
	case []models.Order:
		head := make([]byte, 2)
		switch dataType[0].(type) {
		case models.FormOrder:
			binary.LittleEndian.PutUint16(head, FrontOrderId)
		case models.ControlOrder:
			binary.LittleEndian.PutUint16(head, ControlOrderId)
		default:
			trace.Warn().Msg("Does NOT match any ORDER type")
			return nil
		}

		return Prepend(conversions.GetAllBytesFromOrder(dataType), head...)
	default:
		trace.Warn().Msg("Does NOT match any type")
		return nil
	}
}

func Decode(data []byte) (any, error) {
	dataType := binary.LittleEndian.Uint16(data[0:2])
	switch dataType {
	case VehicleStateId:
		return conversions.GetAllVehicleStates(data[2:])
	case FrontOrderId: //TODO: Not needed now
		return nil, errors.New("Decode for this type of order not implemented")
	case ControlOrderId:
		return conversions.GetAllControlOrders(data[2:])
	default:
		trace.Warn().Msg("Does NOT match any type")
		return nil, errors.New("does not match any type in decode function")
	}

}
