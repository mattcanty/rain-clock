const url = require('url')
const express = require('express')
const async = require('async')
const twitter = require('twitter')
const request = require('request')
const dotenv = require('dotenv')
var forecast = require('./forecast.js')
const app = express()

dotenv.load()

app.use(express.static(__dirname + '/public'))

/*var client = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})*/

app.get('/forecast/:latlong', function(req, res){

  var path = url.parse(req.url).pathname

  var coords = path.split('/')[2].split(',')
  var lat = coords[0]
  var long = coords[1]

  forecast.get(lat, long, function(result){
    res.end(JSON.stringify(result))
  });


    /*
    var twitterStatusUpdate =  {
      status:results.one.minutely.summary,
      display_coordinates:true,
      lat:lat,
      long:long
    }

    client.post('statuses/update', twitterStatusUpdate)
    */
})

app.listen(process.env.PORT || 3000, console.log('running'))
