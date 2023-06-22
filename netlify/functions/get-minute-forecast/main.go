package main

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
	fmt.Println("This message will show up in the CLI console.")

	msg := fmt.Sprintf("Hello %v %v", *person.FirstName, *person.LastName)
	responseBody := ResponseBody{
		Message: &msg,
	}
	jbytes, err := json.Marshal(responseBody)
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
    Message *string json:"message"
}

type Person struct {
    FirstName *string json:"firstName"
    LastName  *string json:"lastName"
}