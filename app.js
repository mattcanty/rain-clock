const url = require('url')
const express = require('express')
const async = require('async')
const twitter = require('twitter')
const request = require('request')
const dotenv = require('dotenv')
const app = express()

dotenv.load()

app.use(express.static(__dirname + '/public'))

var client = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

app.get('/forecast/:latlong', function(req, res){

  var path = url.parse(req.url).pathname

  var coords = path.split('/')[2].split(',')
  var lat = coords[0]
  var long = coords[1]

  var requestUrl= `https://api.darksky.net/forecast/${process.env.FORECAST_API_KEY}/${lat},${long}?exclude=currently,daily,alerts,flags`

  async.parallel({
    one: function(callback){
      request(requestUrl, function (error, response, body) {
        if (error) throw error

        callback(null, JSON.parse(body))
      })
    }
  }, function (error, results){
    if (error) throw error

    if(results.one.minutely){
      var responseObject = {
        summary: results.one.minutely.summary,
        data: results.one.minutely.data.slice(0,60)
      }
    } else {
      var responseObject = {
        summary: results.one.hourly.summary
      }
    }

    res.end(JSON.stringify(responseObject))

    var twitterStatusUpdate =  {
      status:results.one.minutely.summary,
      display_coordinates:true,
      lat:lat,
      long:long
    }

    client.post('statuses/update', twitterStatusUpdate)
  })
})

app.listen(process.env.PORT || 3000, console.log('running'))
