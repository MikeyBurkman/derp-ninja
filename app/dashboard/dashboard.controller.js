(function(){
	'use strict';

	angular
		.module('app.dashboard')
		.controller('DashboardController', DashboardController);

	DashboardController.$inject = [];

	function DashboardController(){
		var vm  = this;
		vm.welcomeMessage = 'Welcome to DERP NINJA';

		/////////////
	}

})();