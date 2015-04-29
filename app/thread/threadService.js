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
			getThreadMessages: getThreadMessages,
			createMessage: createMessage
		};

		return service;

		////////////////////

		function createMessage(message, id) {
			var req = {
				method: 'POST',
				url: '/api/threads/' + id + '/messages',
				header: {
					'Content-Type': 'application/json'
				},
				data: message
			}

			var deferred = $q.defer();

			$http(req)
				.success(function(message){
					deferred.resolve(message);
				})
				.catch(function(err){
					deferred.reject(err);
				});

				return deferred.promise;
		}

		function getThreads() {
			var req = {
				method: 'GET',
				url: '/api/threads',
				header: {
					'Content-Type': 'application/json'
				}
			}

			var deferred = $q.defer();

			$http(req)
				.success(function(threads){
					deferred.resolve(threads)
				})
				.catch(function(err){
					deferred.reject(err);
				});

				return deferred.promise;
		}

		function getThreadMessages(id) {
			var req = {
				method: 'GET',
				url: '/api/threads/' + id + '/messages',
				header: {
					'Content-Type': 'application/json'
				}
			}

			var deferred = $q.defer();

			$http(req)
				.success(function(messages){
					deferred.resolve(messages);
				})
				.catch(function(err){
					deferred.reject(err);
				});

				return deferred.promise;
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
	}

})();
