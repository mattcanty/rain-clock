const url = require('url')
const forecast = require('../forecast/client.js');

exports.get = function(req,res){
  var path = url.parse(req.url).pathname

  var coords = path.split('/')[2].split(',')
  var lat = coords[0]
  var long = coords[1]

  forecast.get(lat, long, function(result) {
    res.end(JSON.stringify(result))
  });
}
