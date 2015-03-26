(function(){
	'use strict';

	angular
		.module('app.user')
		.factory('AuthenticationService', AuthenticationService);

	AuthenticationService.$inject = ['$http', '$q'];

	function AuthenticationService($http, $q) {
		var service = {
			addUser: addUser,
			loginUser: loginUser,
			checkAuthenticationStatus: checkAuthenticationStatus,
			logoutUser: logoutUser
		}

		return service;

		/////////////////////////////////////

		function addUser(user) {
			var req = {
				method: 'POST',
				url: '/api/users',
				headers: {
				  'Content-Type': 'application/json'
				},
				data: { username: user.username, password: user.password}
			}
			var deferred = $q.defer();
			$http(req)
				.success(function(data, status, headers, config){
					deferred.resolve(data);
				})
				.error(function(data, status, headers, config){
					deferred.reject(data);
				});
			return deferred.promise;
		}

		function loginUser(user) {
			var req = {
				method: 'POST',
				url: '/api/login',
				headers: {
				  'Content-Type': 'application/json'
				},
				data: { username: user.username, password: user.password}
			}
			var deferred = $q.defer();
			$http(req)
				.success(function(data, status, headers, config){
					deferred.resolve(data);
				})
				.error(function(data, status, headers, config){
					deferred.reject(data);
				});
			return deferred.promise;
		}

		function checkAuthenticationStatus() {

		}

		function logoutUser() {

		}
	}

})();