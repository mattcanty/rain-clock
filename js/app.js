var Vue = require('vue');
Vue.use(require('vue-resource'));

var data = {
  message: 'Locating you...',
  latitude: undefined,
  longitude: undefined
}

function parseGeocodeResult(result) {
  console.debug(result)

  data.message = result[0].formatted_address
}

function geocodePosition(latitude, longitude) {
  var requestUri = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude;
  
  var response = Vue.http.get(requestUri, function(data, status, request){
    console.debug(data)
    console.debug(status)
    console.debug(request)

    parseGeocodeResult(data.results)
  })
}

function updatePosition(currentPosition) {
  console.debug(currentPosition)

  data.latitude = currentPosition.coords.latitude
  data.longitude = currentPosition.coords.longitude

  data.message = 'found you at ' + data.latitude + ' ' + data.longitude

  geocodePosition(data.latitude, data.longitude)
}

new Vue({
  el: '#location',
  data: data,
  created: navigator.geolocation.getCurrentPosition(updatePosition, console.error)
})