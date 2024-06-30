package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/NordGus/solitaire/html"
	"github.com/NordGus/solitaire/staticfileserver"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	port := os.Getenv("PORT")

	htmlApp, err := html.New()
	if err != nil {
		log.Fatalln(err)
	}

	statictfileserverApp, err := staticfileserver.New()
	if err != nil {
		log.Fatalln(err)
	}

	router := chi.NewRouter()
	router.Use(middleware.Logger)
	router.Use(devCORSMiddleware)

	htmlApp.Routes(router)
	statictfileserverApp.Routes(router)

	err = http.ListenAndServe(fmt.Sprintf(":%v", port), router)
	if err != nil {
		log.Fatalf("something went wrong initalizing http server: %v\n", err)
	}
}

func devCORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")

		next.ServeHTTP(writer, request)
	})
}
