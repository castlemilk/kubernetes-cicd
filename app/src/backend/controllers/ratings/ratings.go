package ratings

import (
	"net/http"
  "github.com/gin-gonic/gin"
	"backend/db"
	"backend/models"
	"fmt"
	uuid "github.com/satori/go.uuid"
)

type Uri struct {
  ProductID string `uri:"product_id"`
  RatingID string `uri:"id"`
}

func GetRatings(c *gin.Context) {
	var uri Uri
	var ratings []models.Rating

	if err:= c.ShouldBindUri(&uri); err != nil {
		c.JSON(400, gin.H{"msg": err})
		return
	}

	id, _ := uuid.FromString(uri.ProductID)
	db := db.GetDB()
	if err := db.Table("ratings").Find(&ratings, "product_id = ?", id).Error; err != nil {
		fmt.Printf("no items found!\n")
    c.AbortWithStatus(http.StatusNotFound)
    return
	}

  c.BindJSON(&ratings)
  c.JSON(http.StatusOK, &ratings)
}

func CreateRating(c *gin.Context) {
  var rating models.Rating
  var db = db.GetDB()

  if err := c.BindJSON(&rating); err != nil {
    c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
      "error": err.Error(),
    })
    return
  }
  db.Create(&rating)
  c.JSON(http.StatusOK, &rating)
}


func GetRating(c *gin.Context) {
	var uri Uri
	

	if err:= c.ShouldBindUri(&uri); err != nil {
		c.JSON(400, gin.H{"msg": err})
		return
	}

	productID, _ := uuid.FromString(uri.ProductID)
	ratingID, _ := uuid.FromString(uri.RatingID)

	rating := new(models.RatingDetails)
	db := db.GetDB()
	if err := db.Table("ratings").Find(&rating, "id = ? AND product_id = ?", ratingID, productID).Error; err != nil {
		fmt.Printf("no items found!\n")
    c.AbortWithStatus(http.StatusNotFound)
    return
	}
  c.BindJSON(&rating)
  c.JSON(http.StatusOK, &rating)
}