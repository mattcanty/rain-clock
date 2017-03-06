const twitter = require('twitter')

var client = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

exports.post = function(req, res) {
  res.end();

  var twitterStatusUpdate =  {
    status:results.one.minutely.summary,
    display_coordinates:true,
    lat:lat,
    long:long
  }

  client.post('statuses/update', twitterStatusUpdate)
}
