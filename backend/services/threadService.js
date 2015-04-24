//threadService.js
//This service is used for creating, deleting and modifying threads

'use strict';

module.exports = {
    locals: [
        'utils.logger',
        'daos.threadDao'
    ],
    init: init
};

function init(eggnog) {

    var threadDao = eggnog.import('daos.threadDao');
    var logger = eggnog.import('utils.logger')(__filename);

    eggnog.exports = threadService;

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
            return threadDao.findThreadsByUser(userId);
        }

        return {
            createThread: createThread,
            deleteThread: deleteThread,
            getThreadsForUser: getThreadsForUser,
            addUserToThread: addUserToThread
        };
    }
}
