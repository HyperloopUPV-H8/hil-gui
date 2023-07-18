package main

// HIL messages
type FinishSimulationHil struct{}

const FinishSimulationHilMsg = "finish_simulation"

func (msg FinishSimulationHil) Encode() []byte {
	return []byte(FinishSimulationHilMsg)
}

// Front messages
type StartSimulationFront struct{}

const StartSimulationMsg = "start_simulation"

func (msg StartSimulationFront) Encode() []byte {
	return []byte(StartSimulationMsg)
}

type FinishSimulationFront struct{}

func (msg FinishSimulationFront) Encode() []byte {
	return []byte(FinishSimulationFrontMsg)
}

const FinishSimulationFrontMsg = "finish_simulation"
