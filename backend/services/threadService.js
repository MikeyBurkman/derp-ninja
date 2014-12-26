//threadService.js
//This service is used for creating, deleting and modifying threads

module.exports = {
    import: [
        'utils.logger',
        'daos.threadDao'
    ],
    init: init
}

function init(imports) {

    var q = require('q');
    var threadDao = imports.get('daos.threadDao');
    var logger = imports.get('utils.logger')(__filename);

    return threadService;

    function threadService(cache) {
        if(!cache) {
            logger.warn('please initialize the thread service with a cache');
            throw ({message:'no cache configured'});
        }

        function createThread(userId, title, tags) {
            return threadDao
                    .createThread(userId, title, tags)
                    .then(function(thread){
                        cache.storeThread(thread);
                        return thread;
                    });
        }

        function deleteThread(threadId){
            return threadDao.remove(threadId);
        }

        function addUserToThread(userId, threadId) {

        }

        function getThreadsForUser(userId) {
            return threadDao
                    .findThreadsByUser(userId)
                    .then(function(threads){
                        if(threads.length == 0) return q.reject({empty:userId+' is in no threads'});
                        return threads;
                    })
                    .catch(function(err){
                        return q.reject(err);
                    });
        }

        return {
            createThread: createThread,
            deleteThread: deleteThread,
            getThreadsForUser: getThreadsForUser,
            addUserToThread: addUserToThread
        };
    }
}
