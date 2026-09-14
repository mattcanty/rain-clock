package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

var weatherAPIURL = os.Getenv("WEATHER_API_URL")
var weatherAPIKey = os.Getenv("WEATHER_API_KEY")

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
	lat, err := strconv.ParseFloat(request.QueryStringParameters["lat"], 64)
	if err != nil {
		return errorResponse(http.StatusBadRequest, "invalid or missing lat"), nil
	}
	lon, err := strconv.ParseFloat(request.QueryStringParameters["lon"], 64)
	if err != nil {
		return errorResponse(http.StatusBadRequest, "invalid or missing lon"), nil
	}

	url := fmt.Sprintf("%s?lat=%f&lon=%f&appid=%s", weatherAPIURL, lat, lon, weatherAPIKey)

	resp, err := http.Get(url)
	if err != nil {
		return errorResponse(http.StatusBadGateway, "failed to reach weather provider"), nil
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return errorResponse(http.StatusBadGateway, "failed to read weather provider response"), nil
	}
	if resp.StatusCode != http.StatusOK {
		return errorResponse(http.StatusBadGateway, "weather provider returned an error"), nil
	}

	var weatherResponse WeatherResponse
	if err := json.Unmarshal(body, &weatherResponse); err != nil {
		return errorResponse(http.StatusBadGateway, "failed to parse weather provider response"), nil
	}

	minutes := weatherResponse.Data
	if len(minutes) > 60 {
		minutes = minutes[:60]
	}

	forecast := make([]ForecastMinute, len(minutes))
	for i, m := range minutes {
		probability := 0.0
		if m.Precipitation > 0 {
			probability = 1
		}
		forecast[i] = ForecastMinute{
			Time:              m.Dt * 1000,
			PrecipIntensity:   m.Precipitation,
			PrecipProbability: probability,
		}
	}

	jbytes, err := json.Marshal(forecast)
	if err != nil {
		return errorResponse(http.StatusInternalServerError, "failed to build response"), nil
	}

	return &events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Headers: map[string]string{
			"Content-Type":                "application/json",
			"Access-Control-Allow-Origin": "*",
		},
		Body: string(jbytes),
	}, nil
}

func errorResponse(status int, message string) *events.APIGatewayProxyResponse {
	body, _ := json.Marshal(map[string]string{"error": message})
	return &events.APIGatewayProxyResponse{
		StatusCode: status,
		Headers: map[string]string{
			"Content-Type":                "application/json",
			"Access-Control-Allow-Origin": "*",
		},
		Body: string(body),
	}
}

func main() {
	lambda.Start(handler)
}
