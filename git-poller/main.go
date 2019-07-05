package main

import (
	"log"
	"net/http"
	"io/ioutil"
)
func main() {
	resp, err := http.Get("https://api.github.com/repos/castlemilk/kubernetes-cicd/pulls")
	if err != nil {
		// handle error
		log.Fatal(err)
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	log.Printf(string(body))
}

