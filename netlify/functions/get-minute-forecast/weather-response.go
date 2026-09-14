package main

type WeatherResponse struct {
	Data []struct {
		Dt            int64   `json:"dt"`
		Precipitation float64 `json:"precipitation"`
	} `json:"data"`
}

type ForecastMinute struct {
	Time              int64   `json:"time"`
	PrecipIntensity   float64 `json:"precipIntensity"`
	PrecipProbability float64 `json:"precipProbability"`
}
