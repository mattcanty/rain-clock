I'm keen to develop this further, check out the [Trello board](https://trello.com/b/UUUBvkE2/weather-clock) and lend a hand!

# Weather Clock
## How-to in Two
1. Go to [weatherclock.matthewcanty.co.uk](http://weatherclock.matthewcanty.co.uk/ "http://weatherclock.matthewcanty.co.uk/") 
2. Know your hyper-local rain forecast

## WTF?
Yeah I guess you're mind is melting right now. You're either looking at a blank clock - which is great, no rain! - or you're looking at some blue bars.

There are two scales which dictate the forecast, colour depth and bar height (distance from edge of clock to centre.

The forecast is hyper-local, therefore it requires your device's location.

### Example 1
<img src=example1.jpg height=600 />
*It is raining heavily now, but it is dissipating. By 1345 the rain will be something like what you might call spitting.*

### Example 2
<img src=example2.jpg height=600 />
*It's just tipping it down. Mental rain for over an hour.*

## Contributing
### Getting started
#### Prerequisites
1. NodeJS - https://nodejs.org/en/
2. Heroku Toolbelt - https://toolbelt.heroku.com/
3. _Forecast IO_ API key - https://developer.forecast.io/

#### Installing
1. `git clone git@github.com:matthewcanty/weather-clock.git`
2. `npm install`
3. `echo "FORECAST_API_KEY=YOUR_FORECAST_IO_API_KEY" > .env`

#### Running
1. `heroku local web`
2. Navigate to http://localhost:5000/