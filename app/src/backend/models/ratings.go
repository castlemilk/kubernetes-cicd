package models

import (
	"time"
	uuid "github.com/satori/go.uuid"
	"github.com/jinzhu/gorm"
)
// Rating - main interface which surfaces available query methods
type Rating interface {
	ListRatings() ([]RatingSummary, error)
	Get(ID string) (ProductDetails, error)
	Create(product ProductDetails) (uuid.UUID, error)
}
// RatingSummary "Object"
type RatingSummary struct { // table name: ratings
	ID          uuid.UUID 			`json:"id"`
	Value       float64    			`gorm:"column:rating" binding:"required"`
	ProductID   uuid.UUID				`json:"product_id" binding:"required"`
}

// RatingDetails "Object"
type RatingDetails struct { // table name: ratings
	ID          uuid.UUID `json:"id"`
	Value       float64    `gorm:"column:rating" binding:"required"`
	CreatedAt 	time.Time `gorm:"column:posting_date" binding:"required"`
}


// ListRatings - returns a list of available products
func ListRatings(db *gorm.DB, productID string) ([]RatingSummary, error) {
	var ratings []RatingSummary
	var id uuid.UUID
	var err error

	if id, err = uuid.FromString(productID); err != nil {
		return nil, err
	}
	if err := db.Table("ratings").Find(&ratings, "product_id = ?", id).Error; err != nil {
		return nil, err
	}
	return ratings, err
}