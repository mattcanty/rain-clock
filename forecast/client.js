const request = require('request');
const baseUri = `https://api.darksky.net`;
const forecastResource = `${baseUri}/forecast/${process.env.FORECAST_API_KEY}`;
const exclude = `currently,daily,alerts,flags`;

exports.get = function(latitude, longigtude, callback) {
  var uri = `${forecastResource}/${latitude},${longigtude}?exclude=${exclude}`;

  request(uri, function (error, response, body) {
    if (error) throw error;

    var data = JSON.parse(body);

    if(!data.minutely){
      callback({
        summary: data.hourly.summary
      });
    }

    callback({
      summary: data.minutely.summary,
      data: data.minutely.data.slice(0,60)
    });
  });
}
