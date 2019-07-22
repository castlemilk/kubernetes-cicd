package models

import (
	uuid "github.com/satori/go.uuid"
	"github.com/jinzhu/gorm"
	"math"
	"fmt"
)

// ProductSummary "Object"
type ProductSummary struct { // table name: products
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name" binding:"required"`
	ImageURL		string		`json:"image_url" binding:"required"`
}

// ProductDetails "Object"
type ProductDetails struct { // table name: products
	ID          	uuid.UUID 			`json:"id"`
	Name        	string    			`json:"name" binding:"required"`
	Title					string					`json:"title" binding:"required"`
	Description 	string					`json:"description" gorm:"column:descr" binding:"required"`
	ImageURL			string					`json:"image_url" binding:"required"`
	// ----------------- ENABLE_RATING --------------------
	// Ratings				RatingsAverage	`json:"ratings" gorm:"-"`
	// ----------------------------------------------------
}

// Product - main interface which surfaces available query methods
type Product interface {
	List() ([]ProductDetails, error)
	Get(ID string) (ProductDetails, error)
	Create(product ProductDetails) (uuid.UUID, error)
}
// ListProducts - returns a list of available products
func ListProducts(db *gorm.DB) ([]ProductSummary, error) {
	var products []ProductSummary
	err := db.Table("products").Find(&products).Error
	return products, err
}

// GetProduct - returns product matching the given id
func GetProduct(db *gorm.DB, ID string) (ProductDetails, error) {
	id, _ := uuid.FromString(ID)
	var product ProductDetails
	var err error

	if err := db.Table("products").Find(&product, "id = ?", id).Error; err != nil {
		return product, err
	}
	// --------------- ENABLE_RATING ----------------------
	// product.Ratings, err = GetProductRatings(db, ID)
	// ----------------------------------------------------

	return product, err
}
// GetProductRatings - create a new product
func GetProductRatings(db *gorm.DB, ID string) (RatingsAverage, error) {
	id, _ := uuid.FromString(ID)
	var ratingsQuery RatingsAverageQuery
	if err := db.Table("ratings").Select("COUNT(product_id) AS total_ratings, COALESCE(SUM(rating), 0) AS sum_ratings").Where("product_id = ?", id).First(&ratingsQuery).Error; err != nil{
		fmt.Printf("error occured fetching average rating: %s", err)
		return RatingsAverage{Average: 0, TotalRatings: 0}, err
	}
	if ratingsQuery.TotalRatings == 0 {
		return RatingsAverage{Average: 0, TotalRatings: 0}, nil 
	}
	average := math.Round((ratingsQuery.SumRatings / float64(ratingsQuery.TotalRatings)) * 100) / 100
	return RatingsAverage{Average: average, TotalRatings: ratingsQuery.TotalRatings}, nil
}

// CreateProduct - create a new product
func CreateProduct(db *gorm.DB, product ProductDetails) (uuid.UUID, error) {
	err := db.Table("products").Create(&product).Error
	return product.ID, err
}
