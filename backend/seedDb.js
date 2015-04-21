//seed the database
//adds entries for users, threads and messages
//
//
//

module.exports = {
    locals: [
        'models.user',
        'models.thread',
        'models.message'
    ],
    externals: [
        'mongoose',
        'bluebird'
    ],
    init: init
}

// TODO: Haven't actually tested this yet... but it looks good!
function init(eggnog) {

  var Promise = eggnog.import('bluebird');
  var mongoose = eggnog.import('mongoose');
  Promise.promisifyAll(mongoose);

  //initalize connection to db
  mongoose.connect('mongodb://localhost:27017/derp-ninja');

  //bring in the models
  var User = eggnog.import('models.user');
  var Thread = eggnog.import('models.thread');
  var Message = eggnog.import('models.message').Message;

  //create and save a user
  var aUser = new User();

  aUser._id = 'testEmail@email.com';
  aUser.displayName = 'test';

  aUser.saveAsync()
    .then(function() {
      console.log('saved user; trying to create thread and message');

      var aThread = new Thread();
      aThread.users = [{
        user: aUser._id,
        createdThread: true
      }];
      aThread.title = 'Test thread';
      aThread.tags = ['first'];

      var aMessage = new Message();
      aMessage.user = aUser;
      aMessage.messageText = 'this is a test message';

      aThread.messages = [aMessage];

      return aThread.saveAsync();
    })
    .then(function() {
      console.log('saved thread');
    })
    .catch(function(err) {
      console.error('Error! ', err);
    });
}
