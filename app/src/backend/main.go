package main

import (
	"os"
	"fmt"
	"github.com/gin-gonic/gin"
)

var (
	postgresURL				string
	postgresUsername	string
	postgresPassword	string
)

func main() {

	postgresURL := os.Getenv("PRODUCTS_DB_URL")
	postgresUsername := os.Getenv("PRODUCTS_DB_USERNAME")
	postgresPassword := os.Getenv("PRODUCTS_DB_PASSWORD")
	fmt.Printf("Postgres URL: %s\n", postgresURL)
	fmt.Printf("Postgres Username: %s\n", postgresUsername)
	fmt.Printf("POstgres Passowrd: %s\n", postgresPassword)


	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	r.Run() // listen and serve on 0.0.0.0:8080
}