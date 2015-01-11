(function(){
	'use strict';

	angular
		.module('app.user')
		.controller('SignupController', SignupController);

	SignupController.$inject = ['AuthenticationService', '$state'];

	function SignupController(AuthenticationService, $state) {
		var vm = this;
		vm.username = '';
		vm.password = '';
		vm.reenterPassword = '';

		vm.signup = signup;

		//////////////////////

		function signup() {
			AuthenticationService
				.addUser(vm)
				.then(function(user){
					console.log('user created');
					return user;
				}, function(error){
					console.log('unable to create user');
				})
				.then(function(user){
					$state.go('dashboad');
				});
		}
	}
})();