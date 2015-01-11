(function(){
	'use strict';

	angular
		.module('app.user')
		.factory('UserService', UserService);

	UserService.$inject = ['$http', '$q'];

	function UserService($http, $q) {
		var service = {
			getLoggedInFriends: getLoggedInFriends
		}

		return service;

		///////////////

		function getLoggedInFriends(){
			var deferred = $q.defer();
			$http
				.get('/api/user/friend')
				.success(function(res){
					deferred.resolve(res.friends);
				})
				.error(function(errorMessage){
					deferred.reject(errorMessage.message);
				});
			return deferred.promise;
		}
	}
})();