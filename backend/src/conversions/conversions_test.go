package conversions

import (
	"reflect"
	"testing"

	"github.com/HyperloopUPV-H8/hil-gui/backend/models"
)

type ConversionCaseBytes struct {
	buf    []models.VehicleState
	result []models.VehicleState
}

func TestConversionToVehicleStateArray(t *testing.T) {
	t.Run("struct conversion", func(t *testing.T) {
		cases := []ConversionCaseBytes{
			{buf: []models.VehicleState{
				{XDistance: 2.45, YDistance: 2.45, ZDistance: 2.45, Current: 4.3, Duty: 1, Temperature: 10.2, XRotation: 2.45, YRotation: 2.45, ZRotation: 2.45},
				{XDistance: 3.21, YDistance: 8.41, ZDistance: 2, Current: 7.44, Duty: 81, Temperature: 58.07, XRotation: 0, YRotation: 0.3, ZRotation: 1},
				{XDistance: 20.45, YDistance: 3.45, ZDistance: 0.45, Current: 4.3, Duty: 1, Temperature: 10.2, XRotation: 1.11, YRotation: 2, ZRotation: 0.5}},
				result: []models.VehicleState{
					{XDistance: 2.45, YDistance: 2.45, ZDistance: 2.45, Current: 4.3, Duty: 1, Temperature: 10.2, XRotation: 2.45, YRotation: 2.45, ZRotation: 2.45},
					{XDistance: 3.21, YDistance: 8.41, ZDistance: 2, Current: 7.44, Duty: 81, Temperature: 58.07, XRotation: 0, YRotation: 0.3, ZRotation: 1},
					{XDistance: 20.45, YDistance: 3.45, ZDistance: 0.45, Current: 4.3, Duty: 1, Temperature: 10.2, XRotation: 1.11, YRotation: 2, ZRotation: 0.5}}},
		}

		for _, testCase := range cases {
			bytes := GetAllBytesFromVehiclesState(testCase.buf)
			got, _ := GetAllVehicleStates(bytes)

			if !reflect.DeepEqual(got, testCase.result) {
				t.Fatalf("Wanted %f, got %f", testCase.result[1].Current, got[1].Current)
			}
		}

	})
}
