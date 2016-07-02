const url = require('url');
const express = require('express');
const Forecast = require('forecast.io');
const https = require('https');
const async = require('async');
const app = express();

var oneDay = 86400000;

app.use(express.static(__dirname + '/public', { maxAge: oneDay }));

app.get('/forecast/:latlong', function(req, res){

  var path = url.parse(req.url).pathname;

  var coords = path.split('/')[2].split(',');

  var options = {
    APIKey: process.env.FORECAST_API_KEY,
    timeout: 1000,
    exclude: 'daily,flags,alerts'
  };

  var forecast = new Forecast(options);

  var requestUrl= `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords[0]},${coords[1]}&location_type=ROOFTOP&result_type=street_address&key=${process.env.GOOGLE_API_KEY}`

  async.parallel({
    one: function(callback) {
      forecast.get(coords[0], coords[1], function (error, forecastRes, data) {
        callback(error, {
          minutely: data.minutely,
          hourly: data.hourly
        })
      })
    },
    two: function(callback) {
      https.get(requestUrl, (response) => {
        var str = '';

        response.on('data', function (chunk) {
          str += chunk;
        });

        response.on('end', function () {
          callback(null, JSON.parse(str).results[0].formatted_address);
        });
      }).on('error', (error) => {
        callback(error);
      })
    }
  }, function (error, results){
    if (error) throw error;

    res.end(JSON.stringify({
      minutely: results.one.minutely,
      hourly: results.one.hourly,
      streetAddress: results.two
    }));
  });
});

app.listen(process.env.PORT || 3000, console.log('running'));