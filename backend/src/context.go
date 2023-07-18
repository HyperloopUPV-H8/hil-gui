package main

import (
	"context"
	"errors"
)

var Finished = errors.New("finished")

func WhileValid(ctx context.Context, cb func() error) {
	for {
		select {
		case <-ctx.Done():
			return
		default:
			err := cb()

			if errors.Is(err, Finished) {
				return
			} else 

			if err := cb(); err != nil {
				break
			}
		}
	}
}
