const url = require('url');
const express = require('express');
const https = require('https');
const async = require('async');
const twitter = require('twitter');
const app = express();

var oneDay = 86400000;

app.use(express.static(__dirname + '/public', { maxAge: oneDay }));

var client = new twitter({
  consumer_key: 'j719S6KgYyiYqrkpM1wMB2Yd4',
  consumer_secret: 'aPAZJf5unQLGvSKvDOoWMNVgoQixlBJ3kXog8WDdSAW7seVBki',
  access_token_key: '828746310161424385-n9va4x4CtSy9gYkTcqnXqX6soV2TSUN',
  access_token_secret: 'huhppunWIMraaEQvk98jRXaTaEhxxhCQaK9nDdZhuXs5c'
});

app.get('/forecast/:latlong', function(req, res){

  var path = url.parse(req.url).pathname;

  var coords = path.split('/')[2].split(',');

  var requestUrl= `https://api.darksky.net/forecast/${process.env.FORECAST_API_KEY}/${coords[0]},${coords[1]}?exclude=currently,hourly,daily,alerts,flags`

  async.parallel({
    one: function(callback){
      https.get(requestUrl, (response) => {
        var str = '';

        response.on('data', function (chunk) {
          str += chunk;
        });

        response.on('end', function () {
          callback(null, JSON.parse(str));
        });
      }).on('error', (error) => {
        console.error(error);
        throw error;
      })
    }
  }, function (error, results){
    if (error){
      console.error(error);
      throw error;
    }

    res.end(JSON.stringify(results.one.minutely));

    client.post('statuses/update', {status:results.one.minutely.summary,display_coordinates:true,lat:coords[0],long:coords[1]})
  });
});

app.listen(process.env.PORT || 3000, console.log('running'));
