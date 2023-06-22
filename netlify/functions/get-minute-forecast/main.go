package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

var apiKey = os.Getenv("PIRATE_WEATHER_API_KEY")

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
	fmt.Println("This message will show up in the CLI console.")

	url := fmt.Sprintf("https://api.pirateweather.net/forecast/%s/54.049591,-2.798430", apiKey)

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

	responseBody := ResponseBody{
		Message: &weatherResponse.Currently.Summary,
	}
	jbytes, _ := json.Marshal(responseBody)
	jstr := string(jbytes)

	return &events.APIGatewayProxyResponse{
		StatusCode:      200,
		Headers:         map[string]string{"Content-Type": "application/json"},
		Body:            jstr,
		IsBase64Encoded: false,
	}, nil
}

func main() {
	lambda.Start(handler)
}

type ResponseBody struct {
	Message *string `json:"message"`
}
