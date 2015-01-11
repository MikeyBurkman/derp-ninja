(function(){
	'use strict';

	angular
		.module('app.user')
		.run(appRun);

	appRun.$inject = ['routerHelper'];

	function appRun(routerHelper) {
		routerHelper.configureStates(getStates(), 'login');
	}

	function getStates() {
		return [
			{
				state: 'login',
				config: {
					url: '/login',
					controller: 'LoginController',
					controllerAs: 'vm',
					templateUrl: 'user/login.html',
					title: 'login'
				}
			},
			{
				state: 'signup',
				config: {
					url: '/signup',
					controller: 'SignupController',
					controllerAs: 'vm',
					templateUrl: 'user/signup.html',
					title: 'signup'
				}
			}
		]	
	}

})();