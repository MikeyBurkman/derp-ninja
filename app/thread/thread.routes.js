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
			}
		]
	}
})();