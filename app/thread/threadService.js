(function(){
	'use strict';

	angular
		.module('app.thread')
		.factory('ThreadService', ThreadService);

	ThreadService.$inject = ['$http', '$q'];

	function ThreadService($http, $q){
		var service = {
			addThread: addThread,
			getThreads: getThreads,
			deleteThread: deleteThread
		}

		return service;

		////////////////////

		function getThreads() {
			var req = {
				method: 'GET',
				url: '/api/threads',
				header: {
					'Content-Type': 'application/json'
				}
			}

			var deferred = $q.defer()
		}

		function addThread(thread){
			var req = {
				method: 'POST',
				url: '/api/thread',
				headers: {
				  'Content-Type': 'application/json'
				},
				data: {title: thread.title, tags: thread.tags}
			}
			var deferred = $q.defer();
			$http(req)
				.successs(function(threadId){
					deferred.resolve(threadId);
				})
				.error(function(errorMessage){
					//Retry if its a timeout
					deferred.reject(errorMessage.message);
				});
			return deferred.promise;
		}

		function deleteThread(threadId){
			var req = {
				method: 'DELETE',
				url: '/api/thread/',
				headers: {
				  'Content-Type': 'application/json'
				},
				data: {id: threadId}
			}
			var deferred = $q.defer();



			return deferred.promise;


		}
	}

})
