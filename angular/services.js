var services = angular.module('services', []);
 
services.factory('forecast', function(){
    
    var forecast = {};
    
    forecast.message = function(){
      return "Hello World!";
    }
 
    return forecast;
});