package main

import (
	"encoding/binary"
	"io"

	"github.com/HyperloopUPV-H8/hil-gui/backend/models"
)

type Decoder interface {
	Decode(r io.Reader) (any, error)
}

type vehicleStateDecoder struct{}

func (decoder vehicleStateDecoder) Decode(r io.Reader) (any, error) {
	var state models.VehicleState
	err := binary.Read(r, binary.BigEndian, &state)
	return state, err
}
