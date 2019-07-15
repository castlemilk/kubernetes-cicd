package models

import (
	uuid "github.com/satori/go.uuid"
)

// Product "Object"
type Product struct { // table name: products
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name" binding:"required"`
}

// ProductDetails "Object"
type ProductDetails struct { // table name: products
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name" binding:"required"`
	Title				string		`json:"title" binding:"required"`
	Description string		`gorm:"column:descr" binding:"required"`
	ImageURL		string		`json:"image_url" binding:"required"`

}
