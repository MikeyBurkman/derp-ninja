(function(){
	'use strict';

	angular
		.module('app.user')
		.controller('LoginController', LoginController);

	LoginController.$inject = ['AuthenticationService', '$state'];

	function LoginController(AuthenticationService, $state){
		var vm = this;
		vm.username = '';
		vm.password = '';
		vm.message = '';

		vm.login = login;

		//////////////////

		function login() {
			AuthenticationService
				.loginUser(vm)
				.then(function(user){
					vm.message = "user logged in";	
					return user;	
				}, function(error){
					vm.message = "user not logged in";
				})
				.then(function(user){
					$state.go('dashboard');
				});

		}
	};

})();