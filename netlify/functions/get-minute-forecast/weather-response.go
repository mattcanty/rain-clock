package main

type WeatherResponse struct {
	Latitude  float64 `json:"latitude,omitempty"`
	Longitude float64 `json:"longitude,omitempty"`
	Timezone  string  `json:"timezone,omitempty"`
	Offset    float64 `json:"offset,omitempty"`
	Elevation int     `json:"elevation,omitempty"`
	Currently struct {
		Time                 int     `json:"time,omitempty"`
		Summary              string  `json:"summary,omitempty"`
		Icon                 string  `json:"icon,omitempty"`
		NearestStormDistance int     `json:"nearestStormDistance,omitempty"`
		NearestStormBearing  int     `json:"nearestStormBearing,omitempty"`
		PrecipIntensity      int     `json:"precipIntensity,omitempty"`
		PrecipProbability    int     `json:"precipProbability,omitempty"`
		PrecipIntensityError int     `json:"precipIntensityError,omitempty"`
		PrecipType           string  `json:"precipType,omitempty"`
		Temperature          float64 `json:"temperature,omitempty"`
		ApparentTemperature  float64 `json:"apparentTemperature,omitempty"`
		DewPoint             float64 `json:"dewPoint,omitempty"`
		Humidity             float64 `json:"humidity,omitempty"`
		Pressure             float64 `json:"pressure,omitempty"`
		WindSpeed            float64 `json:"windSpeed,omitempty"`
		WindGust             float64 `json:"windGust,omitempty"`
		WindBearing          float64 `json:"windBearing,omitempty"`
		CloudCover           float64 `json:"cloudCover,omitempty"`
		UvIndex              float64 `json:"uvIndex,omitempty"`
		Visibility           int     `json:"visibility,omitempty"`
		Ozone                float64 `json:"ozone,omitempty"`
	} `json:"currently,omitempty"`
	Minutely struct {
		Summary string `json:"summary,omitempty"`
		Icon    string `json:"icon,omitempty"`
		Data    []struct {
			Time                 int     `json:"time,omitempty"`
			PrecipIntensity      float64 `json:"precipIntensity,omitempty"`
			PrecipProbability    float64 `json:"precipProbability,omitempty"`
			PrecipIntensityError float64 `json:"precipIntensityError,omitempty"`
			PrecipType           string  `json:"precipType,omitempty"`
		} `json:"data,omitempty"`
	} `json:"minutely,omitempty"`
	Flags struct {
		Sources     []string `json:"sources,omitempty"`
		SourceTimes struct {
			Gfs  string `json:"gfs,omitempty"`
			Gefs string `json:"gefs,omitempty"`
		} `json:"sourceTimes,omitempty"`
		NearestStation int    `json:"nearest-station,omitempty"`
		Units          string `json:"units,omitempty"`
		Version        string `json:"version,omitempty"`
	} `json:"flags,omitempty"`
}
