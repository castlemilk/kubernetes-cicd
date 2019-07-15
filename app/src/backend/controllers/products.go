package products

import (
	"net/http"
  "github.com/gin-gonic/gin"
	"backend/db"
	"backend/models"
	"github.com/davecgh/go-spew/spew"
	"fmt"
	uuid "github.com/satori/go.uuid"
)

func GetProducts(c *gin.Context) {

  var products []models.Product
  db := db.GetDB()
  db.Find(&products)
  c.JSON(200, products)
}

type Uri struct {
  ID string `uri:"id" binding:"required"`
}

func GetProduct(c *gin.Context) {
	var uri Uri
	

	if err:= c.ShouldBindUri(&uri); err != nil {
		c.JSON(400, gin.H{"msg": err})
		return
	}

	id, _ := uuid.FromString(uri.ID)
	product := new(models.ProductDetails)
	db := db.GetDB()
	if err := db.Table("products").Find(&product, "id = ?", id).Error; err != nil {
		fmt.Printf("no items found!\n")
    c.AbortWithStatus(http.StatusNotFound)
    return
	}
  // if err := db.Model(product).Table("products").Where("id = ?", uri.ID).Select(product).Error; err != nil {
	// 	fmt.Printf("no items found!\n")
  //   c.AbortWithStatus(http.StatusNotFound)
  //   return
	// }
	fmt.Printf("product.id: %s\n", product.ID)
	spew.Dump(product)
  c.BindJSON(&product)
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
}
