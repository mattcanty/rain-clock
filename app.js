var url = require('url');
var express = require('express');
var Forecast = require('forecast.io');
var app = express();

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

  forecast.get(coords[0], coords[1], function (err, forecastRes, data) {
    if (err) throw err;

    res.end(JSON.stringify(data));
  });
});

app.listen(process.env.PORT || 3000);