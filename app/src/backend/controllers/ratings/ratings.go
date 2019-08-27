package ratings

import (
	"backend/db"
	"backend/models"
	"fmt"
	"github.com/gin-gonic/gin"
	uuid "github.com/satori/go.uuid"
	"net/http"
)

// URI - struct for the parameters passed to the given endpoints
type URI struct {
	ProductID string `uri:"product_id"`
	RatingID  string `uri:"id"`
}

// ListRatings - show all ratings for a specific product
func ListRatings(c *gin.Context) {
	var uri URI
	var ratings []models.RatingSummary
	var err error
	db := db.GetDB()
	if err := c.ShouldBindUri(&uri); err != nil {
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
	var ratingCreated models.RatingCreated
	var rating models.RatingSummary
	var db = db.GetDB()
	var err error

	if err := c.BindJSON(&rating); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	if ratingCreated, err = models.CreateRating(db, rating); err != nil {
		fmt.Printf("failed to create rating!\n")
		c.AbortWithStatus(http.StatusInternalServerError)
	}
	c.JSON(http.StatusOK, ratingCreated)
}

// DeleteRating - remove rating from given product
func DeleteRating(c *gin.Context) {
	var uri URI
	var rating models.RatingSummary
	var db = db.GetDB()

	if err := c.ShouldBindUri(&uri); err != nil {
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
	db := db.GetDB()

	if err := c.ShouldBindUri(&uri); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	rating, err := models.GetRating(db, uri.RatingID)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
	}
	c.JSON(http.StatusOK, &rating)
}
