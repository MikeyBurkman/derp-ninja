(function(){
	'use strict';

	angular
		.module('app.thread')
		.run(appRun);

	appRun.$inject = ['routerHelper'];

	function appRun(routerHelper) {
		routerHelper.configureStates(getStates());
	}

	function getStates() {
		return [
			{
				state: 'addThread',
				config: {
					url: '/addThread',
					controller: 'AddThreadController',
					controllerAs: 'vm',
					templateUrl: 'thread/addThread.html',
					title: 'Add a Thread'
				}
			},
			{
				state: 'view-thread',
				config: {
					url: '/viewThread/:id',
					controller: 'ViewThreadController',
					controllerAs: 'vm',
					templateUrl: 'thread/viewThread.html',
					resolve: {
						messages: ['ThreadService', '$stateParams', function(ThreadService, $stateParams){
							console.log($stateParams.id);
							return ThreadService.getThreadMessages($stateParams.id);
						}]
					}
				}
			}
		]
	}
})();
