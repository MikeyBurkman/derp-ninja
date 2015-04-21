
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
  var MessageThread = eggnog.import('models.thread');
  var messageModel = eggnog.import('models.message');

  eggnog.exports = {
    createThread: createThread,
    createMessage: createMessage,
    lookupMessages: lookupMessages,
    findThreadsByUser: findThreadsByUser
  };

  function createThread(userId, title, tags) {
  	var userEntry = {
  		user: userId,
  		createdThread: true
  	};

  	var t = new MessageThread();

    t.users = [];
    t.users.push(userEntry);
    t.title = title
    t.tags = tags;

    return t.saveAsync();
  };

  function findThreadsByUser(userId) {
    return MessageThread.find({'users.user':userId}).execAsync();
  };

  function createMessage(threadId, message) {
    return MessageThread.findOne({_id:threadId}).execAsync()
      .then(function(thread) {
        var msg = new messageModel.Message();
        msg.user = message.user;
        msg.messageText = message.text;
        thread.messages.push(msg);
        return thread.saveAsync();
      });
  };

  function lookupMessages(threadId, minTimestamp) {
    return MessageThread.findOne({_id: threadId}).execAsync();
  };

}
