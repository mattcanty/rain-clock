const url = require('url');
const express = require('express');
const async = require('async');
const twitter = require('twitter');
const request = require('request');
const dotenv = require('dotenv');
const app = express();

dotenv.load();

var oneDay = 86400000;

app.use(express.static(__dirname + '/public', { maxAge: oneDay }));

var client = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

app.get('/forecast/:latlong', function(req, res){

  var path = url.parse(req.url).pathname;

  var coords = path.split('/')[2].split(',');

  var requestUrl= `https://api.darksky.net/forecast/${process.env.FORECAST_API_KEY}/${coords[0]},${coords[1]}?exclude=currently,daily,alerts,flags`

  async.parallel({
    one: function(callback){
      request(requestUrl, function (error, response, body) {
        if (error) throw error;

        callback(null, JSON.parse(body));
      })
    }
  }, function (error, results){
    if (error) throw error;

    if(!results.one.minutely){
      res.end(JSON.stringify({summary: results.one.hourly.summary}));
      return;
    }

    res.end(JSON.stringify(results.one.minutely));

    // client.post('statuses/update', {status:results.one.minutely.summary,display_coordinates:true,lat:coords[0],long:coords[1]})
  });
});

app.listen(process.env.PORT || 3000, console.log('running'));
