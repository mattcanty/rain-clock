var forecast;

function Clock($scope, apis){

  function init(){
    $scope.summary = "Requesting Forecast...";
    $scope.position = "Won't be long :-)";
    $scope.lastUpdated = "Never";
    
    $scope.refreshForecast();
  }

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
          $scope.$apply();
        } else {
          $scope.position('Position not found');
        }
      } else {
        $scope.position('Geocoder failed: ' + status);
      }
    });
  }
  
  function showError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        $scope.position = "User denied the request for Geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        $scope.position = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        $scope.position = "The request to get user location timed out.";
        break;
      case error.UNKNOWN_ERROR:
        $scope.position = "An unknown error occurred.";
        break;
    }
  }
  
  init();
}