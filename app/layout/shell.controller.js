(function(){
	'use strict';

	angular
		.module('app.layout')
		.controller('ShellController', ShellController);

	ShellController.$inject = ['$timeout', '$state'];

	function ShellController($timeout, $state) {
		var vm = this;
		vm.showSidebar = showSidebar;

		//////////////
		function showSidebar(){
			return !($state.is('login') || $state.is('signup'));
		}

	}

})();