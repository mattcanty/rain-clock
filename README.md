# Links
* [Wiki](https://github.com/matthewcanty/weather-clock/wiki)
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
1. In terminal `watchify -d -t browserify-css js/index.js -p [minifyify --no-map] -o public/js/bundle.js`
2. In another terminal `heroku local web`
3. Navigate to [http://localhost:5000/](http://localhost:5000/)
