package main

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	"testing"
	"backend/db"
	"backend/models"
)

func performRequest(r http.Handler, method, path string) *httptest.ResponseRecorder {
	req, _ := http.NewRequest(method, path, nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

func TestGetProduct(t *testing.T) {
	// Build our expected body
	gin.SetMode(gin.ReleaseMode)
	body := gin.H{
		"id":          "52c65bc6-4cc8-484b-afee-e03dfd5ebd12",
		"name":        "AVACADO",
		"title":       "Avocado",
		"Description": "Fresh and perfectly ripe Avocadoes",
		"image_url":   "avocado.png",
	}
	db.Init()
	// Grab our router
	router := SetupRouter()
	// Perform a GET request with that handler.
	w := performRequest(router, "GET", "/api/v1/products/52c65bc6-4cc8-484b-afee-e03dfd5ebd12")
	// Assert we encoded correctly,
	// the request gives a 200
	assert.Equal(t, http.StatusOK, w.Code)
	// Convert the JSON response to a map
	var response map[string]string
	err := json.Unmarshal([]byte(w.Body.String()), &response)
	// Grab the value & whether or not it exists
	value, exists := response["name"]
	// Make some assertions on the correctness of the response.
	assert.Nil(t, err)
	assert.True(t, exists)
	assert.Equal(t, body["name"], value)
}
func TestGetProducts(t *testing.T) {
	// Build our expected body
	db.Init()
	// Grab our router
	router := SetupRouter()
	// Perform a GET request with that handler.
	w := performRequest(router, "GET", "/api/v1/products/")
	// Assert we encoded correctly,
	// the request gives a 200
	assert.Equal(t, http.StatusOK, w.Code)
	// Convert the JSON response to a map
	var response []map[string]string
	err := json.Unmarshal([]byte(w.Body.String()), &response)
	_, exists := response[0]["name"]
	// Grab the value & whether or not it exists
	// Make some assertions on the correctness of the response.
	assert.Nil(t, err)
	assert.True(t, exists)
	assert.Equal(t, len(response), 10)
}


func TestGetRatings(t *testing.T) {
	// Build our expected body
	db.Init()
	// Grab our router
	router := SetupRouter()
	// Perform a GET request with that handler.
	w := performRequest(router, "GET", "/api/v1/ratings/52c65bc6-4cc8-484b-afee-e03dfd5ebd12")
	// Assert we encoded correctly,
	// the request gives a 200
	assert.Equal(t, http.StatusOK, w.Code)
	// Convert the JSON response to a map
	var response []models.Rating
	err := json.Unmarshal([]byte(w.Body.String()), &response)
	// Grab the value & whether or not it exists
	// Make some assertions on the correctness of the response.
	assert.Nil(t, err)
	assert.Equal(t, len(response), 4)
}

func TestGetRating(t *testing.T) {
	// Build our expected body
	db.Init()
	// Grab our router
	router := SetupRouter()
	// Perform a GET request with that handler.
	w := performRequest(router, "GET", "/api/v1/ratings/52c65bc6-4cc8-484b-afee-e03dfd5ebd12/e56b3823-9b71-4260-b7a1-0a53766d824d")
	// Assert we encoded correctly,
	// the request gives a 200
	assert.Equal(t, http.StatusOK, w.Code)
	// Convert the JSON response to a map
	var response models.RatingDetails
	err := json.Unmarshal([]byte(w.Body.String()), &response)
	// Grab the value & whether or not it exists
	// Make some assertions on the correctness of the response.
	assert.Nil(t, err)
	assert.Equal(t, response.ID.String(), "e56b3823-9b71-4260-b7a1-0a53766d824d")
}


