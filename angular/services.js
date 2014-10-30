var services = angular.module('services', []);

services.factory('apis', function($http, $q) {
	return({
		getForecast: getForecast
	});

	function getForecast(lat, long) {
		console.log('req: ' + url);

		var request = $http({
			url: url
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
		return( response.data );
	}
});