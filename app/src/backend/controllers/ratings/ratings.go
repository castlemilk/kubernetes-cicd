package ratings

import (
	"net/http"
  "github.com/gin-gonic/gin"
	"backend/db"
	"backend/models"
	"fmt"
	uuid "github.com/satori/go.uuid"
)
// URI - struct for the parameters passed to the given endpoints
type URI struct {
  ProductID string `uri:"product_id"`
  RatingID string `uri:"id"`
}

// ListRatings - show all ratings for a specific product
func ListRatings(c *gin.Context) {
	var uri URI
	var ratings []models.RatingSummary
	var err error
	db := db.GetDB()
	if err:= c.ShouldBindUri(&uri); err != nil {
		c.JSON(400, gin.H{"msg": err})
		return
	}
	if ratings, err = models.ListRatings(db, uri.ProductID); err != nil {
		fmt.Printf("no items found!\n")
    c.AbortWithStatus(http.StatusNotFound)
	}

  c.JSON(http.StatusOK, &ratings)
}

// CreateRating - Create a rating for a given product
func CreateRating(c *gin.Context) {
  var rating models.RatingSummary
  var db = db.GetDB()

  if err := c.BindJSON(&rating); err != nil {
    c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
      "error": err.Error(),
    })
    return
  }
  db.Table("ratings").Create(&rating)
  c.JSON(http.StatusOK, &rating)
}

// DeleteRating - remove rating from given product
func DeleteRating(c *gin.Context) {
	var uri URI
  var rating models.RatingSummary
  var db = db.GetDB()

  if err:= c.ShouldBindUri(&uri); err != nil {
		c.JSON(400, gin.H{"msg": err})
		return
	}

	id, _ := uuid.FromString(uri.RatingID)

	if err := db.Table("ratings").Find(&rating, "id = ?", id).Error; err != nil {
		fmt.Printf("no items found!\n")
    c.AbortWithStatus(http.StatusNotFound)
    return
	}
	db.Table("ratings").Delete(&rating)

  c.JSON(http.StatusOK, &rating)
}

// GetRating - fetch a specific rating for a specific product
func GetRating(c *gin.Context) {
	var uri URI
	

	if err:= c.ShouldBindUri(&uri); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
      "error": err.Error(),
    })
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
  c.JSON(http.StatusOK, &rating)
}