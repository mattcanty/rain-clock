var services = angular.module('services', []);
 
services.factory('forecast', function($http, $q) {
    return({
        getForecast: getForecast,
    });
    
    function getForecast(lat, long) {
        
        var url = 'https://api.forecast.io/forecast/' + forecast_api_key + '/' + lat + ',' + long;
        
        var request = $http({
            method: "jsonp",
            url: url,
            params: {
                callback: 'JSON_CALLBACK'
            }
        });
        
        return( request.then( handleSuccess, handleError ) );
    }
    
    function handleError( response ) {
        if (!angular.isObject( response.data ) ||
            !response.data.message) {
            return( $q.reject( "An unknown error occurred." ) );
        }

        return( $q.reject( response.data.message ) );
    }
    
    function handleSuccess( response ) {
        console.log(response);
        return( response.data );
    }
});