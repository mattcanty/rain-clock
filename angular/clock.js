var forecast;
var selectedForecast;

function Clock($scope, apis){

  $scope.select = function (f) {
    selectedForecast = f;
  };

  function init(){
    $scope.summary = 'Requesting Forecast...';
    $scope.lastUpdated = 'Never';
    
    $scope.position = 'Finding your position';
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setPostition, showError);
    } else {
      $scope.position = 'Geolocation is not supported by this browser.';
    }
  }
  
  function setPostition(position) {
    $scope.latitude = position.coords.latitude;
    $scope.longitude = position.coords.longitude;
    
    var geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng($scope.latitude, $scope.longitude);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          $scope.position = results[0].formatted_address;
          $scope.$apply();
          $scope.refreshForecast();
        } else {
          $scope.position('Position not found');
        }
      } else {
        $scope.position('Geocoder failed: ' + status);
      }
    });
  }
  
  function chooseForecast() {
    selectedForecast = forecast.minutely ? 'minutely' : 'hourly';
    $scope.minutelyAvailable = forecast.minutely;
  }

  $scope.refreshForecast = function(){
    apis.getForecast($scope.latitude, $scope.longitude)
      .then(function(data){
        forecast = data;
        $scope.summary = forecast.currently.summary;
        $scope.lastUpdated = new Date().toLocaleString();
        
        chooseForecast();
      });
  }
  
  function showError(error) {
    $scope.summary = 'Oops!'
    $scope.position = error;
    switch(error.code) {
      case error.PERMISSION_DENIED:
        $scope.position = 'User denied the request for Geolocation.';
        break;
      case error.POSITION_UNAVAILABLE:
        $scope.position = 'Location information is unavailable.';
        break;
      case error.TIMEOUT:
        $scope.position = 'The request to get user location timed out.';
        break;
      case error.UNKNOWN_ERROR:
        $scope.position = 'An unknown error occurred.';
        break;
    }
  }
  
  init();
}