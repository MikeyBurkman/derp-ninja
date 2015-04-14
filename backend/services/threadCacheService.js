// threadCacheService.js
// This is a cache that is used to store threads that 
// have recently been created or accessed

module.exports = {
    init: init
}

function init(eggnog) {

    eggnog.exports = initializeThreadCache;

    function initializeThreadCache() {

        var cache = {};

        function getThread(threadId) {
            var thread = cache[threadId];
            //TODO possibly have this take a callback to get thread on cache miss
            return thread;
        }

        function storeThread(thread) {
            cache[thread._id] = thread;
        }

        function pruneThreads() {
            //TODO use this to clean old threads
            //possibly set this to an internal invertal
        }

        setInterval(pruneThreads, 100000);

        return {
            getThread: getThread,
            storeThread: storeThread
        }

    }
}


