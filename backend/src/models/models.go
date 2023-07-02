package models

import (
	"math"
	"math/rand"
)

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
	VehicleState.XRotation = float64(rand.Float64()*(math.Pi/4)) + (math.Round(rand.Float64()*100) / 100)
	VehicleState.YRotation = float64(rand.Float64()*(math.Pi/4)) + (math.Round(rand.Float64()*100) / 100)
	VehicleState.ZRotation = float64(rand.Float64()*(math.Pi/4)) + (math.Round(rand.Float64()*100) / 100)
	return *VehicleState
}

type Perturbation struct {
	Id    string `json:"id"`
	TypeP string `json:"type"`
	Value int    `json:"value"`
}

type PerturbationOrder []Perturbation

type InputData struct {
	Id       string   `json:"id"`
	Type     string   `json:"type"`
	Value    float64  `json:"value"`
	Enabled  bool     `json:"enabled"`
	Validity Validity `json:"validity"`
}

type Validity struct {
	IsValid bool   `json:"isValid"`
	Msg     string `json:"msg"`
}

type FormData []InputData
