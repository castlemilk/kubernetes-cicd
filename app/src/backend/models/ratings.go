package models

import (
	"time"
	uuid "github.com/satori/go.uuid"
)

// Rating "Object"
type Rating struct { // table name: ratings
	ID          uuid.UUID `json:"id"`
	Value       float64    `gorm:"column:rating" binding:"required"`
}

// Rating "Object"
type RatingDetails struct { // table name: ratings
	ID          uuid.UUID `json:"id"`
	Value       float64    `gorm:"column:rating" binding:"required"`
	CreatedAt 	time.Time `"gorm:column:posting_date" binding:"required"`
}