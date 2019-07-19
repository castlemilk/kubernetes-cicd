package db

import (
	"backend/models"
	"fmt"
	"log"
	"os"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

var db *gorm.DB
var err error

//Init ...
func Init() {

	user := getEnv("PG_USER", "demoz")
	password := getEnv("PG_PASSWORD", "1234")
	host := getEnv("PG_HOST", "localhost")
	port := getEnv("PG_PORT", "5432")
	database := getEnv("PG_DB", "products")

	dbinfo := fmt.Sprintf("user=%s password=%s host=%s port=%s dbname=%s sslmode=disable",
		user,
		password,
		host,
		port,
		database,
	)

	db, err = gorm.Open("postgres", dbinfo)
	if err != nil {
		log.Println("Failed to connect to database")
		panic(err)
	}
	log.Println("Database connected")
	if !db.HasTable(&models.Product{}) {
		panic("table not found: products")
	}
	db.AutoMigrate(&models.Product{})

}

//GetDB ...
func GetDB() *gorm.DB {
	return db
}

