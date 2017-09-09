/*global localStorage*/
/*global Vue*/
/*global navigator*/

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

  var requestUri = 'https://domsd7l1pe.execute-api.eu-west-2.amazonaws.com/Prod/forecast?latitude=' + data.latitude + '&longitude=' + data.longitude
  // var uploadUri = '/upload'

  Vue.http.get(requestUri).then(
    response => {
      var weatherData = response.json()

      data.weatherSummary = weatherData.summary

      localStorage.setItem("forecast", JSON.stringify(weatherData))

      /*
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
      */
    },
    error => console.debug)
}

var vm1 = new Vue({
  el: '#forecast',
  data: data,
  created: navigator.geolocation.getCurrentPosition(onPositionUpdated, console.error)
})

function clock(){
  function drawPrediction(ctx, data){
    data.forEach(function(item){
      var minute = new Date(item.time * 1000).getMinutes();
      var intensity = item.precipIntensity;
      var probability = item.precipProbability;
      var x = radius - (intensity * 500);

      var color = "rgba(0, 0, 255, " + probability + ")";

      ctx.save();
      ctx.rotate(minute * Math.PI/30);
      ctx.strokeStyle = "white";
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(radius,0);
      ctx.lineTo(radius * Math.cos(2 * Math.PI / 60), radius * Math.sin(2 * Math.PI / 60));
      ctx.lineTo(x * Math.cos(2 * Math.PI / 60), x * Math.sin(2 * Math.PI / 60));
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
      ctx.globalCompositeOperation = 'destination-atop';
      ctx.restore();
    });
  }

  var now = new Date();
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var canvasParent = canvas.parentNode;
  var size = Math.min(canvasParent.offsetWidth, canvasParent.offsetHeight);
  var radius = size * 0.48;
  var secondsRadius = radius * 0.95;
  var minutesRadius = radius * 0.99;
  var hoursRadius = radius * 0.95;
  var clockDiameter = radius * 2;


  ctx.save();
  ctx.clearRect(0,0,size,size);
  ctx.translate(radius, radius);
  ctx.rotate(-Math.PI/2);
  ctx.strokeStyle = "black";
  ctx.fillStyle = "white";
  ctx.lineWidth = size / 240;
  ctx.lineCap = "round";

  if(localStorage.forecast){
    drawPrediction(ctx, JSON.parse(localStorage.forecast).data);
  }

  // Hour marks
  ctx.save();
  ctx.strokeStyle = "black";
  ctx.fillStyle = "white";
  ctx.lineWidth = size / 120;
  ctx.lineCap = "round";

  for (var i = 0; i < 12; i += 1){
    ctx.beginPath();
    ctx.rotate(Math.PI/6);
    ctx.moveTo(hoursRadius,0);
    ctx.lineTo(radius,0);
    ctx.stroke();
  }

  ctx.restore();

  // Minute marks
  ctx.save();
  ctx.lineWidth = size / 240;
  for (i = 0; i < 60; i += 1){
    if (i%5!=0) {
      ctx.beginPath();
      ctx.moveTo(minutesRadius,0);
      ctx.lineTo(radius,0);
      ctx.stroke();
    }

    ctx.rotate(Math.PI/30);
  }
  ctx.restore();
  var sec = now.getSeconds();
  var min = now.getMinutes();
  var hr  = now.getHours();
  hr = hr >= 12 ? hr-12 : hr;

  ctx.fillStyle = "black";

  // write Hours
  ctx.save();
  ctx.rotate(hr*(Math.PI/6) + (Math.PI/360)*min + (Math.PI/21600)*sec);
  ctx.lineWidth = size / 120;
  ctx.beginPath();
  ctx.moveTo(size * -0.05,0);
  ctx.lineTo(size * 0.24,0);
  ctx.stroke();
  ctx.restore();

  // write Minutes
  ctx.save();
  ctx.rotate((Math.PI/30)*min + (Math.PI/1800)*sec);
  ctx.lineWidth = size / 240;
  ctx.beginPath();
  ctx.moveTo(size * -0.05,0);
  ctx.lineTo(size * 0.4,0);
  ctx.stroke();
  ctx.restore();

  // Write seconds
  ctx.save();
  ctx.rotate(sec * Math.PI/30);
  ctx.strokeStyle = "#D40000";
  ctx.fillStyle = "#D40000";
  ctx.lineWidth = size / 240;
  ctx.beginPath();
  ctx.moveTo(size * -0.05,0);
  ctx.lineTo(size * 0.4,0);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0,0,size * 0.01,0,Math.PI*2,true);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}
