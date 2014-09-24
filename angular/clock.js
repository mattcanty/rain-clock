function Clock($scope, forecast){
  $scope.serviceMessage = forecast.message();
}