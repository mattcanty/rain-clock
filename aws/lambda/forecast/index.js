'use strict';
console.log('Loading event');

require('dotenv').config();

const DarkSky = require('dark-sky');
const darksky = new DarkSky(process.env.DARKSKY_APIKEY);

exports.handler = function(event, context, callback) {
  darksky
    .latitude(event.queryStringParameters.latitude)
    .longitude(event.queryStringParameters.longitude)
    .exclude('currently,daily,alerts,flags')
    .get()
    .then((darkSkyResult) => {
      if(darkSkyResult.minutely) {
        var raindata = darkSkyResult.minutely.data.slice(0,60)
      }

      var response = {
        summary: darkSkyResult.minutely ? darkSkyResult.minutely.summary : darkSkyResult.hourly.summary,
        data: raindata
      };

      callback(null, {
        statusCode: 200,
        body: JSON.stringify(response),
        headers: {
          'Access-Control-Allow-Origin':'https://rainclock.mattcanty.com'
        }
      });
    })
    .catch(callback)
};
