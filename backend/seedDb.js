//seed the database
//adds entries for users, threads and messages
//
//
//

module.exports = {
    import: [{
        id: 'models.user',
        as: 'user'
    }, {
        id: 'models.thread',
        as: 'thread'
    }, {
        id: 'models.message',
        as: 'message'
    }],
    init: init
}

var mongoose = require('mongoose');

function init(imports) {

    //initalize connection to db
    mongoose.connect('mongodb://localhost:27017/derp-ninja');

    //bring in the models
    var User = imports.user;
    var Thread = imports.thread;
    var Message = mongoose.model('Message', imports.message);

    //create and save a user
    var aUser = new User();

    aUser._id = 'testEmail@email.com';
    aUser.displayName = 'test';

    aUser.save(function(err){
        if(err) {
            console.log(err);
        }
        else {
            console.log('saved a user');
        }
    });

    var aMessage = new Message();
    aMessage.user = aUser;
    aMessage.messageText = 'this is a test message';

    var aThread = new Thread();
    aThread.users = [];
    var userEntry = {};
    userEntry.user = aUser._id;
    userEntry.createdThread = true;
    aThread.users.push(userEntry);
    aThread.title = 'Test thread';
    aThread.tags = ['first'];
    aThread.messages = [aMessage];

    aThread.save(function(err){
            if(err){
                console.log(err);
            }
            else {
                console.log('saved thread');
            }
    });

}
