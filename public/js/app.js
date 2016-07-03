var data = {
  locationMessage: 'Finding you.',
  latitude: undefined,
  longitude: undefined,
  raw: undefined
}

function updateLocationMessage(locationMessage){
  data.locationMessage = locationMessage
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
    },
    (response) => console.debug);
}

var vm1 = new Vue({
  el: '#forecast',
  data: data,
  created: navigator.geolocation.getCurrentPosition(onPositionUpdated, console.error),
  ready: document.getElementById('street-address').style.visibility = 'visible'
})

var vm2 = new Vue({
  el: '#time-range',
  methods: {
    setTimeRange: function(timeRangeSelection){
      timeRange = timeRangeSelection
    }
  }
})
