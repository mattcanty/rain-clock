var data = {
  locationMessage: 'Finding you.',
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

function onPositionUpdated(currentPosition) {
  data.latitude = currentPosition.coords.latitude
  data.longitude = currentPosition.coords.longitude

  data.locationMessage = 'Getting forecast.'

  var requestUri = '/forecast/' + data.latitude + ',' + data.longitude;

  Vue.http.get(requestUri).then(
    (response) => {
      
      forecast = response.json();

      data.locationMessage = forecast.streetAddress;

      updateLastRefreshTime()

    },
    (response) => console.debug);
}

var vm1 = new Vue({
  el: '#forecast',
  data: data,
  created: navigator.geolocation.getCurrentPosition(onPositionUpdated, console.error)
})

var vm2 = new Vue({
  el: '#time-range',
  methods: {
    setTimeRange: function(timeRangeSelection){
      timeRange = timeRangeSelection
    }
  }
})
