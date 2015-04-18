
module.exports = {
    locals: [
        'models.thread',
        'models.message',
        'utils.logger'
    ],
    externals: [
        'q'
    ],
    init: init
};

function init(eggnog) {

  var q = eggnog.import('q');
  var logger = eggnog.import('utils.logger')(__filename);
  var MessageThread = eggnog.import('models.thread');
  var messageModel = eggnog.import('models.message');

  eggnog.exports = {
    createThread: createThread,
    createMessage: createMessage,
    lookupMessages: lookupMessages,
    findThreadsByUser: findThreadsByUser
  };

  function createThread(userId, title, tags) {
  	var defer = q.defer();

  	var userEntry = {
  		user: userId,
  		createdThread: true
  	};

  	var t = new MessageThread();

      t.users = [];
      t.users.push(userEntry);
      t.title = title
      t.tags = tags;

      t.save(function(err, thread){
        if(err){
            defer.reject(err);
        } else {
        	defer.resolve(thread);
        }
      });

      return defer.promise;
  };

  function findThreadsByUser(userId) {
    var defer = q.defer();

    MessageThread
      .find({'users.user':userId}).exec()
      .then(function(threads) {
        defer.resolve(threads);
      }, function(err) {
        defer.reject(err);
      });

    return defer.promise;
  };

  function createMessage(threadId, message) {
  	var deferred = q.defer();

  	var query = MessageThread.findOne({_id:threadId})

    return q.ninvoke(query, 'exec')
      .then(function(thread) {
        var msg = new messageModel.Message();
        msg.user = message.user;
        msg.messageText = message.text;
        thread.messages.push(msg);
        return q.ninvoke(thread, 'save');
      });
  };

  // TODO
  function lookupMessages(threadId, minTimestamp) {
  	var defer = q.defer();

    MessageThread.findOne({_id: threadId}).exec()
      .then(function(thread) {
        defer.resolve(thread.messages);
      }, function(err) {
        defer.reject(err);
      });

  	return defer.promise;
  };

}
