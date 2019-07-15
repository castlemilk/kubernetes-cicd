package products

import (
	"net/http"
  "github.com/gin-gonic/gin"
	"backend/db"
	"backend/models"
)

func GetProducts(c *gin.Context) {

  var products []models.Product
  db := db.GetDB()
  db.Find(&products)
  c.JSON(200, products)
}

func CreateProduct(c *gin.Context) {
  var product models.Product
  var db = db.GetDB()

  if err := c.BindJSON(&product); err != nil {
    c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
      "error": err.Error(),
    })
    return
  }
  db.Create(&product)
  c.JSON(http.StatusOK, &product)
}
