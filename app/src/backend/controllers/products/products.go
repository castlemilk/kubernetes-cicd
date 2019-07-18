package products

import (
	"net/http"
  "github.com/gin-gonic/gin"
	"backend/db"
	"backend/models"
	uuid "github.com/satori/go.uuid"
)

func GetProducts(c *gin.Context) {

  var products []models.ProductDetails
  db := db.GetDB()
  db.Table("products").Find(&products)
  c.JSON(200, products)
  return
}

type Uri struct {
  ID string `uri:"id" binding:"required"`
}

func GetProduct(c *gin.Context) {
	var uri Uri
	

	if err := c.ShouldBindUri(&uri); err != nil {
    // c.JSON(400, gin.H{"msg": err})
    c.AbortWithStatus(http.StatusNotFound)
	}

	id, _ := uuid.FromString(uri.ID)
	product := new(models.ProductDetails)
	db := db.GetDB()
	if err := db.Table("products").Find(&product, "id = ?", id).Error; err != nil {
    c.AbortWithStatus(http.StatusNotFound)
	}
  c.JSON(http.StatusOK, &product)
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
  return
}
