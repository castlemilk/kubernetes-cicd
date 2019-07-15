package models

import (
	uuid "github.com/satori/go.uuid"
)

// Rating "Object"
type Rating struct { // table name: ratings
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name" binding:"required"`
}