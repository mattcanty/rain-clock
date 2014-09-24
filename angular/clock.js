function Clock($scope, forecast){
    
    $scope.refreshForecast = function(){
        forecast.getForecast(51.4572,-0.1092)
            .then(function(data){
                forecast = data;
            });
    }
    
    $scope.refreshForecast();
}