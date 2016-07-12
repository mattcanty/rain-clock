[![Dependency Status](https://dependencyci.com/github/matthewcanty/weather-clock/badge)](https://dependencyci.com/github/matthewcanty/weather-clock)
[![Test Coverage](https://codeclimate.com/github/matthewcanty/weather-clock/badges/coverage.svg)](https://codeclimate.com/github/matthewcanty/weather-clock/coverage)
[![Code Climate](https://codeclimate.com/github/matthewcanty/weather-clock/badges/gpa.svg)](https://codeclimate.com/github/matthewcanty/weather-clock)
[![Issue Count](https://codeclimate.com/github/matthewcanty/weather-clock/badges/issue_count.svg)](https://codeclimate.com/github/matthewcanty/weather-clock)
[![Heroku](http://heroku-badge.herokuapp.com/?app=analog-weather-clock-2&style=flat)](https://weatherclock.matthewcanty.co.uk/)

[weatherclock.matthewcanty.co.uk](https://weatherclock.matthewcanty.co.uk/)

### Prerequisites
* [NodeJS](https://nodejs.org/en/)
* [_Forecast IO_ API key](https://developer.forecast.io/)
* [_Google_ API key](https://developers.google.com/maps/documentation/javascript/get-api-key)

```
npm install
echo "FORECAST_API_KEY=YOUR_FORECAST_IO_API_KEY" > .env
echo "GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY" > .env
node app.js
```
