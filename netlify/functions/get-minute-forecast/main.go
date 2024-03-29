package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

var apiKey = os.Getenv("PIRATE_WEATHER_API_KEY")

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
	fmt.Println("This message will show up in the CLI console.")

	latitude, err := strconv.ParseFloat(request.QueryStringParameters["latitude"], 64)
	if err != nil {
		log.Fatal(err)
	}
	longitude, err := strconv.ParseFloat(request.QueryStringParameters["longitude"], 64)
	if err != nil {
		log.Fatal(err)
	}

	url := fmt.Sprintf("https://api.pirateweather.net/forecast/%s/%f,%f", apiKey, latitude, longitude)

	client := &http.Client{}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Fatal(err)
	}
	resp, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()
	bodyText, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
	}
	var weatherResponse WeatherResponse
	if err := json.Unmarshal(bodyText, &weatherResponse); err != nil {
		log.Fatal(err)
	}

	responseBody := []ResponseWeatherData{}

	for _, d := range weatherResponse.Minutely.Data[0:60] {
		responseBody = append(responseBody, ResponseWeatherData{
			Time:              d.Time * 1000,
			PrecipIntensity:   d.PrecipIntensity,
			PrecipProbability: d.PrecipProbability,
		})
	}

	jbytes, _ := json.Marshal(responseBody)
	jstr := string(jbytes)

	return &events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers: map[string]string{
			"Content-Type":                "application/json",
			"Access-Control-Allow-Origin": "*",
		},
		Body:            jstr,
		IsBase64Encoded: false,
	}, nil
}

func main() {
	lambda.Start(handler)
}

type ResponseBody struct {
	// Summary *string               `json:"summary"`
	Data []ResponseWeatherData `json:"data"`
}

type ResponseWeatherData struct {
	Time                 int     `json:"time"`
	PrecipIntensity      float64 `json:"precipIntensity"`
	PrecipProbability    float64 `json:"precipProbability"`
	PrecipIntensityError float64 `json:"precipIntensityError"`
	PrecipType           string  `json:"precipType"`
}
