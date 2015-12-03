var Vue = require('vue');
Vue.use(require('vue-resource'));

var data = {
  locationMessage: 'Locating you...',
  lastRefreshTime: 'Never',
  latitude: undefined,
  longitude: undefined
}

function updateLocationMessage(locationMessage){
  data.locationMessage = locationMessage
}

function updateLastRefreshTime(){
  data.lastRefreshTime = new Date().toLocaleString()
}

function geocodePosition(latitude, longitude) {
  var requestUri = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude;
  
  Vue.http.get(requestUri, function(response, status, request){
    data.locationMessage = response.results[0].formatted_address
  })
}

function getForecast(latitude, longitude) {
  var requestUri = '/forecast/' + latitude + ',' + longitude;

  Vue.http.get(requestUri, function(response, status, request){
    forecast = response
    updateLastRefreshTime()
  })
}

function updatePosition(currentPosition) {
  data.latitude = currentPosition.coords.latitude
  data.longitude = currentPosition.coords.longitude

  data.locationMessage = 'found you at ' + data.latitude + ' ' + data.longitude

  getForecast(data.latitude, data.longitude)
  geocodePosition(data.latitude, data.longitude)
}

var vm = new Vue({
  el: '#forecast',
  data: data,
  created: navigator.geolocation.getCurrentPosition(updatePosition, console.error)
})