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

// RatingCreated "Object"
type RatingCreated struct {
	ID 					uuid.UUID 			`json:"id"` 
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

// CreateRating - create a new product
func CreateRating(db *gorm.DB, rating RatingSummary) (RatingCreated, error) {
	err := db.Table("ratings").Create(&rating).Error
	ratingCreated := RatingCreated{ID: rating.ID}
	return ratingCreated, err
}

// GetRating - create a new product
func GetRating(db *gorm.DB, ID string) (RatingDetails, error) {
	var rating RatingDetails
	id, _ := uuid.FromString(ID)
	err := db.Table("ratings").Find(&rating, "id = ?", id).Error
	
	return rating, err
}

