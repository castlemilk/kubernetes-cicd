package models

import (
	uuid "github.com/satori/go.uuid"
)

// Task "Object
type Product struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name" binding:"required"`
	Title       string    `json:"title" binding:"required"`
	Description string    `json:"descr" binding:"required"`
	ImageURL    string    `json:"image_url" binding:"required"`
}
