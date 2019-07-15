package main

import (
	// "os"
	// "fmt"

	"github.com/gin-gonic/gin"
	"backend/db"
	ProductController "backend/controllers"
)

func main() {

	db.Init();
	r := gin.Default()

	v1 := r.Group("/api/v1")
	{
    products := v1.Group("/products")
    {
      products.GET("/", ProductController.GetProducts)
      products.POST("/", ProductController.CreateProduct)
      // products.PUT("/:id", ProductController.UpdateProduct)
      // products.DELETE("/:id", ProductController.DeleteProduct)
    }
  }

  r.Run()
}