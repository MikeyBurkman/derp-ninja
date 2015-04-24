'use strict';

module.exports = {
    locals: [
        'models.thread',
        'models.message',
        'utils.logger'
    ],
    init: init
};

function init(eggnog) {

  var logger = eggnog.import('utils.logger')(__filename);
  var Thread = eggnog.import('models.thread').Thread;
  var Message = eggnog.import('models.message').Message;

  eggnog.exports = {
    createThread: createThread,
    createMessage: createMessage,
    lookupMessages: lookupMessages,
    findThreadsByUser: findThreadsByUser,
    findUpdatedThreads: findUpdatedThreads
  };

  function createThread(userId, title, tags) {
  	var userEntry = {
  		user: userId,
  		createdThread: true
  	};

  	var t = new Thread();

    t.users = [];
    t.users.push(userEntry);
    t.title = title;
    t.tags = tags;

    return t.saveAsync();
  }

  function findThreadsByUser(userId) {
    return Thread.find({'users.user':userId}).execAsync();
  }

  function createMessage(threadId, message) {
    return Thread.findOne({_id:threadId}).execAsync()
      .then(function(thread) {
        var msg = new Message();
        msg.user = message.user;
        msg.messageText = message.text;
        thread.messages.push(msg);
        return thread.saveAsync();
      });
  }

  function lookupMessages(threadId, minTimestamp) {
    return Thread.findOne({_id: threadId}).execAsync();
  }

  // Find all threads for the given user that have messages later than minTimestamp
  function findUpdatedThreads(userId, minTimestamp) {
    // TODO: Implement
    return Thread.Find({'users.user': userId}).execAsync();
  }

}
