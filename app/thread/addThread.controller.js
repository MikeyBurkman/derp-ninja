(function(){
	'use strict';

	angular
		.module('app.thread')
		.controller('AddThreadController', AddThreadController);

	AddThreadController.$inject = ['ThreadService', '$state'];

	function AddThreadController(ThreadService, $state){
		var vm = this;
		vm.title = '';
		vm.tags = [];
		vm.error = '';


		////////////////
		function addThread(vm) {
			ThreadService
				.addNewThread(vm)
				.then(function(){
					$state.go('dashboard');
				}, function(err){
					vm.error = err.message;
				});
		}
	}
})();