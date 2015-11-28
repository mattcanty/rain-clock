# Links
* [Github Page](http://matthewcanty.github.io/weather-clock)
* [Staging](https://analog-weather-clock-staging.herokuapp.com/)
* [Production](http://weatherclock.matthewcanty.co.uk/)

# Local Development
### Prerequisites
* [NodeJS](https://nodejs.org/en/)
* [Heroku Toolbelt](https://toolbelt.heroku.com/)
* [_Forecast IO_ API key](https://developer.forecast.io/)
* [Git](https://git-scm.com/)

### Installing
1. `git clone git@github.com:matthewcanty/weather-clock.git`
2. `npm install`
3. `echo "FORECAST_API_KEY=YOUR_FORECAST_IO_API_KEY" > .env`

### Running
1. `heroku local web`
2. Navigate to [http://localhost:5000/](http://localhost:5000/)