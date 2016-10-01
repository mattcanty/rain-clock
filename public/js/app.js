var data = {
  weatherSummary: 'Hang on a sec.',
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

  data.locationMessage = "Location accurate to " + currentPosition.coords.accuracy + " metres.";

  var requestUri = '/forecast/' + data.latitude + ',' + data.longitude;

  Vue.http.get(requestUri).then(
    (response) => {
      var weatherData = response.json();

      data.weatherSummary = weatherData.summary;

      localStorage.setItem("forecast", JSON.stringify(weatherData));
    },
    (response) => console.debug);
}

var vm1 = new Vue({
  el: '#forecast',
  data: data,
  created: navigator.geolocation.getCurrentPosition(onPositionUpdated, console.error)
})
