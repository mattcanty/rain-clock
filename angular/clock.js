var forecast;

function Clock($scope, forecastApi){

  $scope.refreshForecast = function(){
    forecastApi.getForecast(51.4572,-0.1092)
      .then(function(data){
        forecast = data;
    });
  }
  
  $scope.refreshForecast();
}