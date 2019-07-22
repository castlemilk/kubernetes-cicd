package main

import (
	ProductController "backend/controllers/products"
	RatingController "backend/controllers/ratings"
	"backend/db"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	// "time"
)

// SetupRouter - responsible for initializing our Gin routes
func SetupRouter() *gin.Engine {
	r := gin.Default()
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowHeaders = []string{"Cache-Control", "Content-Type"}
	r.Use(cors.New(config))
	v1 := r.Group("/api/v1")
	{
		products := v1.Group("/products")
		{
			products.GET("/", ProductController.ListProducts)
			products.GET("/:id", ProductController.GetProduct)
		}
		ratings := v1.Group("/ratings")
		{
			ratings.GET("/:product_id", RatingController.ListRatings)
			ratings.GET("/:product_id/:id", RatingController.GetRating)
			ratings.POST("/:product_id", RatingController.CreateRating)
			ratings.DELETE("/:id", RatingController.DeleteRating)
		}
		images := v1.Group("/images")
		images.Static("/", "./assets/images")
	}
	return r
}

func main() {

	db.Init()

	r := SetupRouter()
	err := r.Run()
	if err != nil {
		panic(err)
	}
}
