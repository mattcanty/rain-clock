var data = {
  weatherSummary: 'Hang on a sec.',
  locationMessage: 'Finding you.'
}

function updateLocationMessage(locationMessage){
  data.locationMessage = locationMessage
}

function onPositionUpdated(currentPosition) {
  data.latitude = currentPosition.coords.latitude
  data.longitude = currentPosition.coords.longitude

  data.locationMessage = "Location accurate to " + currentPosition.coords.accuracy + " metres."

  var requestUri = '/forecast/' + data.latitude + ',' + data.longitude
  var uploadUri = '/upload'

  Vue.http.get(requestUri).then(
    response => {
      var weatherData = response.json()

      data.weatherSummary = weatherData.summary

      localStorage.setItem("forecast", JSON.stringify(weatherData))

      var canvas = document.getElementById("canvas");
      var dataUrl = canvas.toDataURL();
      var dataUrlCropped = dataUrl.replace('data:image/png;base64,', '');

      Vue.http.post('/upload', dataUrlCropped)
        .then(function(response){
          console.log(response);
        }, function (response) {
          console.log(response);
      });

      Vue.http.post(uploadUri, dataURL);
    },
    error => console.debug)
}

var vm1 = new Vue({
  el: '#forecast',
  data: data,
  created: navigator.geolocation.getCurrentPosition(onPositionUpdated, console.error)
})
