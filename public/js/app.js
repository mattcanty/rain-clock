var data = {
  locationMessage: 'Locating you...',
  lastRefreshTime: 'Never',
  latitude: undefined,
  longitude: undefined,
  raw: undefined
}

function updateLocationMessage(locationMessage){
  data.locationMessage = locationMessage
}

function updateLastRefreshTime(){
  data.lastRefreshTime = new Date().toLocaleString()
}

function geocodePosition(latitude, longitude) {
  var requestUri = '/address/' + latitude + ',' + longitude;

  Vue.http.get(requestUri).then(
    (response) => data.locationMessage = response.text(),
    (response) => console.debug);
}

function getForecast(latitude, longitude) {
  var requestUri = '/forecast/' + latitude + ',' + longitude;

  Vue.http.get(requestUri).then(
    (response) => {
      forecast = response.json();
      updateLastRefreshTime()
    },
    (response) => console.debug);
}

function updatePosition(currentPosition) {
  data.latitude = currentPosition.coords.latitude
  data.longitude = currentPosition.coords.longitude

  data.locationMessage = 'Found you at ' + data.latitude + ' ' + data.longitude

  getForecast(data.latitude, data.longitude)
  geocodePosition(data.latitude, data.longitude)
}

var vm1 = new Vue({
  el: '#forecast',
  data: data,
  created: navigator.geolocation.getCurrentPosition(updatePosition, console.error)
})

var vm2 = new Vue({
  el: '#time-range',
  methods: {
    setTimeRange: function(timeRangeSelection){
      timeRange = timeRangeSelection
    }
  }
})
