const twitter = require('twitter');
const fs = require('fs');

var forecastStore = null;

exports.setForecastStore = function(store){
  forecastStore = store;
}

const uploadDir = './uploads'

var client = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});


function postMediaTweet(imageData){
  client.post('media/upload', {media_data: imageData}, function(error, media, response) {
    if (error) {
      console.log(JSON.stringify(error));
      console.log(JSON.stringify(response));
      return;
    }

    var forecast = forecastStore.get("key");

    console.log(forecast)

    var status = {
      status:forecast.summary,
      display_coordinates:true,
      lat:forecast.lat,
      long:forecast.long,
      media_ids: media.media_id_string
    };

    client.post('statuses/update', status, function(error, tweet, response) {
      if (error) throw error;
    });
  });
}

exports.post = function(req, res) {
  var data = '';

  req.on('data', function (chunk) {
    data = data + chunk;
  });

  req.on('end', function () {
    res.end("OK");

    console.log(data);

    //fs.writeFile("./test.png", data);

    postMediaTweet(data);
  });

  req.on('error', function(error) {
    throw error;
  });
};
