var forecast;

function Clock($scope, apis){

  $scope.summary = "Requesting Forecast...";

  $scope.refreshForecast = function(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getForecastData, showError);
    } else {
      $scope.summary = "Geolocation is not supported by this browser.";
    }
  }

  function getForecastData(position){
    apis.getForecast(position.coords.latitude,position.coords.longitude)
      .then(function(data){
        forecast = data;
        $scope.summary = data.currently.summary;
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