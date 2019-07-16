package main

import (
	"github.com/gin-gonic/gin"
	"backend/db"
	ProductController "backend/controllers/products"
  RatingController "backend/controllers/ratings"
)

func main() {

	db.Init();
	r := gin.Default()

	v1 := r.Group("/api/v1")
	{
    products := v1.Group("/products")
    {
      products.GET("/", ProductController.GetProducts)
      products.GET("/:id", ProductController.GetProduct)
    }
    ratings := v1.Group("/ratings")
    {
      ratings.GET("/:product_id", RatingController.GetRatings)
      ratings.GET("/:product_id/:id", RatingController.GetRating)
      ratings.POST("/:product_id", RatingController.CreateRating)
    }
    images := v1.Group("/images")
    images.Static("/", "./assets/images")
  }

  r.Run()
}