package main

import (
	"bytes"
	"encoding/binary"
	"math"
	"math/rand"
)

const VEHICLE_STATE_LENGTH = 65

type VehicleState struct {
	XDistance   float64 `json:"xDistance"`
	YDistance   float64 `json:"yDistance"` //Value between 22mm and 10 mm
	ZDistance   float64 `json:"zDistance"`
	Current     float64 `json:"current"`
	Duty        byte    `json:"duty"`
	Temperature float64 `json:"temperature"`
	XRotation   float64 `json:"xRotation"`
	YRotation   float64 `json:"yRotation"`
	ZRotation   float64 `json:"zRotation"`
}

func RandomVehicleState() VehicleState {
	VehicleState := &VehicleState{}
	VehicleState.XDistance = float64(rand.Intn(13)+10) + (math.Round(rand.Float64()*100) / 100)
	VehicleState.YDistance = float64(rand.Intn(13)+10) + (math.Round(rand.Float64()*100) / 100)
	VehicleState.ZDistance = float64(rand.Intn(13)+10) + (math.Round(rand.Float64()*100) / 100)
	VehicleState.Current = float64(rand.Intn(20)) + (math.Round(rand.Float64()*100) / 100)
	VehicleState.Duty = byte(rand.Intn(100))
	VehicleState.Temperature = float64(rand.Intn(40)+20) + (math.Round(rand.Float64()*100) / 100)
	VehicleState.XRotation = getRandomRotation()
	VehicleState.YRotation = getRandomRotation()
	VehicleState.ZRotation = getRandomRotation()
	return *VehicleState
}

func getRandomRotation() float64 {
	return math.Round(float64((rand.Float64()-0.5)*(math.Pi/8))*100) / 100
}

func GetAllVehicleStates(data []byte) ([]VehicleState, error) {
	vehicleStateArray := []VehicleState{}
	reader := bytes.NewReader(data)
	var err error
	for i := 0; i <= len(data)-VEHICLE_STATE_LENGTH; i += VEHICLE_STATE_LENGTH {
		vehicleState := &VehicleState{}
		err = binary.Read(reader, binary.LittleEndian, vehicleState)
		if err != nil {
			break
		}
		vehicleStateArray = append(vehicleStateArray, *vehicleState)
	}
	return vehicleStateArray, err
}

func ConvertFloat64ToBytes(num float64) [8]byte {
	var buf [8]byte
	binary.LittleEndian.PutUint64(buf[:], math.Float64bits(num))
	return buf
}

func GetBytesFromVehicleState(vehicleState VehicleState) []byte {

	buf1 := ConvertFloat64ToBytes(vehicleState.XDistance)
	buf2 := ConvertFloat64ToBytes(vehicleState.YDistance)
	buf3 := ConvertFloat64ToBytes(vehicleState.ZDistance)

	result := append(append(buf1[:], buf2[:]...), buf3[:]...)

	buf4 := ConvertFloat64ToBytes(vehicleState.Current)
	var buf5 [1]byte = [1]byte{vehicleState.Duty}
	buf6 := ConvertFloat64ToBytes(vehicleState.Temperature)

	result = append(append(append(result, buf4[:]...), buf5[:]...), buf6[:]...)

	buf7 := ConvertFloat64ToBytes(vehicleState.XRotation)
	buf8 := ConvertFloat64ToBytes(vehicleState.YRotation)
	buf9 := ConvertFloat64ToBytes(vehicleState.ZRotation)

	return append(append(append(result, buf7[:]...), buf8[:]...), buf9[:]...)
}

func GetAllBytesFromVehicleState(vehiclesState []VehicleState) []byte {
	var result []byte
	for _, vehicle := range vehiclesState {
		result = append(result, GetBytesFromVehicleState(vehicle)...)
	}
	return result
}
