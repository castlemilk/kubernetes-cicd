package models

import (
	uuid "github.com/satori/go.uuid"
	"github.com/jinzhu/gorm"
)

// Product "Object"
type ProductSummary struct { // table name: products
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name" binding:"required"`
	ImageURL		string		`json:"image_url" binding:"required"`
}

// ProductDetails "Object"
type ProductDetails struct { // table name: products
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name" binding:"required"`
	Title				string		`json:"title" binding:"required"`
	Description string		`json:"description" gorm:"column:descr" binding:"required"`
	ImageURL		string		`json:"image_url" binding:"required"`

}
type Product interface {
	List() ([]ProductDetails, error)
	Get(ID string) (ProductDetails, error)
	Create(product ProductDetails) (uuid.UUID, error)
}
// ListProducts - returns a list of available products
func ListProducts(db *gorm.DB) ([]ProductDetails, error) {
	var products []ProductDetails
	err := db.Table("products").Find(&products).Error
	return products, err
}

// GetProduct - returns product matching the given id
func GetProduct(db *gorm.DB, ID string) (ProductDetails, error) {
	id, _ := uuid.FromString(ID)
	var product ProductDetails
	err := db.Table("products").Find(&product, "id = ?", id).Error
	return product, err
}

// CreateProduct - create a new product
func CreateProduct(db *gorm.DB, product ProductDetails) (uuid.UUID, error) {
	err := db.Table("products").Create(&product).Error
	return product.ID, err
}
