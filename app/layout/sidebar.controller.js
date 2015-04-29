(function(){
	'use strict';

	angular
		.module('app.layout')
		.controller('SidebarController', SidebarController);

	SidebarController.$inject = ['$mdSidenav', 'UserService'];

	function SidebarController($mdSidenav, UserService) {
		var vm = this;
		vm.close = close;
		vm.currentFriends = [{name:'test'}];
		setInterval(getCurrentFriends, 500);
		setInterval(getUserThreads, 500);

		////////////////

		function close(){
			console.log('closing');
			$mdSidenav('left').close();
		}

		function getCurrentFriends(){
			UserService
				.getLoggedInFriends()
				.then(function(friends){
					vm.currentFriends = friends;
				}, function(){
					//NOOP we're long polling anyway
				});
		}

		function getUserThreads() {
			
		}

	}

})();
