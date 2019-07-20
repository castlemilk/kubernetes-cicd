package main

import (
	"backend/db"
	"backend/models"
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
)

func performRequest(r http.Handler, method, path string) *httptest.ResponseRecorder {
	req, _ := http.NewRequest(method, path, nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

func performRequestWithPayload(r http.Handler, method, path string, payload []byte) *httptest.ResponseRecorder {
	req, _ := http.NewRequest(method, path, bytes.NewBuffer(payload))
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

func TestAPIGetProduct(t *testing.T) {
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
func TestAPIGetProducts(t *testing.T) {
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

func TestAPIGetRatings(t *testing.T) {
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
	assert.True(t, len(response) >= 4)
}

func TestAPIGetRating(t *testing.T) {
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

func TestAPICreateRating(t *testing.T) {
	// Build our expected body
	db.Init()
	// Grab our router
	router := SetupRouter()
	jsonFile, err := os.Open("tests/fixtures/rating.json")
	ratingByteValue, _ := ioutil.ReadAll(jsonFile)
	// if we os.Open returns an error then handle it
	if err != nil {
		fmt.Println(err)
	}
	// Perform a GET request with that handler.
	w := performRequestWithPayload(router, "POST", "/api/v1/ratings/52c65bc6-4cc8-484b-afee-e03dfd5ebd12", ratingByteValue)

	// Assert we encoded correctly,
	// the request gives a 200
	assert.Equal(t, http.StatusOK, w.Code)

	// Convert the JSON response to a map
	var response models.Rating

	err = json.Unmarshal([]byte(w.Body.String()), &response)
	// Grab the value & whether or not it exists
	// Make some assertions on the correctness of the response.
	assert.Nil(t, err)
	assert.Equal(t, response.Value, 1.1)
	performRequest(router, "DELETE", "/api/v1/ratings/"+response.ID.String())
}

func TestAPIDeleteRating(t *testing.T) {
	// Build our expected body
	db.Init()
	// Grab our router
	router := SetupRouter()
	jsonFile, err := os.Open("tests/fixtures/rating.json")
	ratingByteValue, _ := ioutil.ReadAll(jsonFile)
	// if we os.Open returns an error then handle it
	if err != nil {
		fmt.Println(err)
	}
	// Perform a GET request with that handler.
	w := performRequestWithPayload(router, "POST", "/api/v1/ratings/52c65bc6-4cc8-484b-afee-e03dfd5ebd12", ratingByteValue)

	// Assert we encoded correctly,
	// the request gives a 200
	assert.Equal(t, http.StatusOK, w.Code)

	// Convert the JSON response to a map
	var response models.Rating

	err = json.Unmarshal([]byte(w.Body.String()), &response)
	// Grab the value & whether or not it exists
	// Make some assertions on the correctness of the response.
	assert.Nil(t, err)
	assert.Equal(t, response.Value, 1.1)
	deleter := performRequest(router, "DELETE", "/api/v1/ratings/"+response.ID.String())

	assert.Equal(t, http.StatusOK, deleter.Code)

}

func TestMain(m *testing.M) {
	db.Init()
	exitcode := m.Run()
	os.Exit(exitcode)
}