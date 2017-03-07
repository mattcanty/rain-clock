const NodeCache = require( "node-cache" );
const cache = new NodeCache( { stdTTL: 20, checkperiod: 1200 } );

exports.set = function(key, summary, lat, long) {
  var data = {
    summary: summary,
    lat: lat,
    long: long
  }

  console.log(data)

  cache.set(key, data, function(error, success){
    if(error) throw error;
  });
}

exports.get = function(key) {
  var data = cache.get(key);

  console.log(data)

  return data;
}
