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



// func GetRating(c *gin.Context) {
// 	var uri Uri
	

// 	if err:= c.ShouldBindUri(&uri); err != nil {
// 		c.JSON(400, gin.H{"msg": err})
// 		return
// 	}

// 	id, _ := uuid.FromString(uri.ID)
// 	product := new(models.ProductDetails)
// 	db := db.GetDB()
// 	if err := db.Table("products").Find(&product, "id = ?", id).Error; err != nil {
// 		fmt.Printf("no items found!\n")
//     c.AbortWithStatus(http.StatusNotFound)
//     return
// 	}
//   // if err := db.Model(product).Table("products").Where("id = ?", uri.ID).Select(product).Error; err != nil {
// 	// 	fmt.Printf("no items found!\n")
//   //   c.AbortWithStatus(http.StatusNotFound)
//   //   return
// 	// }
// 	fmt.Printf("product.id: %s\n", product.ID)
// 	spew.Dump(product)
//   c.BindJSON(&product)
//   c.JSON(http.StatusOK, &product)
// }