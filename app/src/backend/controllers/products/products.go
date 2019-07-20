package products

import (
	"net/http"
  "github.com/gin-gonic/gin"
  "backend/models"
  "backend/db"
)

func GetProducts(c *gin.Context) {
  // var product models.Product
	db := db.GetDB()
  products, err := models.ListProducts(db) 
  if err != nil {
    c.AbortWithStatus(http.StatusInternalServerError)
  }
  c.JSON(200, products)
  return
}

type Uri struct {
  ID string `uri:"id" binding:"required"`
}

func GetProduct(c *gin.Context) {
  var uri Uri
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

func CreateProduct(c *gin.Context) {
  var item models.ProductDetails
  db := db.GetDB()

  if err := c.BindJSON(&item); err != nil {
    c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
      "error": err.Error(),
    })
    return
  }
  resp, err := models.CreateProduct(db, item)
  if err != nil {
    c.AbortWithStatus(http.StatusInternalServerError)
	} 
  c.JSON(http.StatusOK, resp)
  return
}
