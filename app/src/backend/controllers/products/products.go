package products

import (
	"net/http"
  "github.com/gin-gonic/gin"
  "backend/models"
  "backend/db"
)
// ListProducts - List available products
func ListProducts(c *gin.Context) {
  // var product models.Product
	db := db.GetDB()
  products, err := models.ListProducts(db) 
  if err != nil {
    c.AbortWithStatus(http.StatusInternalServerError)
  }
  c.JSON(200, products)
}
// URI - struct for the parameters passed to the given endpoints
type URI struct {
  ID string `uri:"id" binding:"required"`
}
// GetProduct - Fetch a specific product based off search ID
func GetProduct(c *gin.Context) {
  var uri URI
  db := db.GetDB() 
	if err := c.ShouldBindUri(&uri); err != nil {
    // c.JSON(400, gin.H{"msg": err})
    c.AbortWithStatus(http.StatusNotFound)
	}
  resp, err := models.GetProduct(db, uri.ID)
	if err != nil {
    c.AbortWithStatus(http.StatusNotFound)
	}
  c.JSON(http.StatusOK, &resp)
}
// CreateProduct - Endpoint for creating a product
func CreateProduct(c *gin.Context) {
  var product models.ProductDetails
  db := db.GetDB()

  if err := c.BindJSON(&product); err != nil {
    c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
      "error": err.Error(),
    })
  }
  id, err := models.CreateProduct(db, product)
  if err != nil {
    c.AbortWithStatus(http.StatusInternalServerError)
	} 
  c.JSON(http.StatusOK, id)
}
