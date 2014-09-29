var forecast;

function Clock($scope, apis){

  $scope.summary = "Requesting Forecast...";
  $scope.position = "Searching for position...";
  $scope.lastUpdated = "Never";

  $scope.refreshForecast = function(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getForecastData, showError);
    } else {
      $scope.summary = "Geolocation is not supported by this browser.";
    }
  }

  function getForecastData(position){
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    
    apis.getForecast(latitude, longitude)
      .then(function(data){
        forecast = data;
        $scope.summary = data.currently.summary;
        $scope.lastUpdated = new Date().toLocaleString();
      });
    
    var geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(latitude, longitude);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          $scope.position = results[0].formatted_address;
        } else {
          alert('No results found');
        }
      } else {
        alert('Geocoder failed due to: ' + status);
      }
    });
  }
  
  function showError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        $scope.summary = "User denied the request for Geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        $scope.summary = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        $scope.summary = "The request to get user location timed out.";
        break;
      case error.UNKNOWN_ERROR:
        $scope.summary = "An unknown error occurred.";
        break;
    }
  }
  
  $scope.refreshForecast();
}