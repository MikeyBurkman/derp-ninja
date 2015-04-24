//thread.js
//domain object for threads within the system
//

'use strict';

module.exports = {
    locals: [
        'models.message'
    ],
    externals: [
        'mongoose'
    ],
    init: init
};

function init(eggnog) {

    var message = eggnog.import('models.message');

    var mongoose = eggnog.import('mongoose');
    var Schema = mongoose.Schema;

    var ThreadSchema = new Schema({
        users: {type: [{
                    user: {type: String, ref: 'User'},
                    joined: {type: Date, default: new Date()},
                    createdThread: Boolean,
                    last_view: {type: String, ref: 'Message'}
                    }],
                required: true,
                },
        created: {type: Date, default: new Date()},
        title: {type: String, required: true},
        tags: [{type: String, default: []}],
        appTags: [{type: String, default: []}],
        messages: {type:[message.schema], default: []}
    });

    ThreadSchema.path('users').validate(function(users) {
        return users.length !== 0;
    });

    eggnog.exports = {
      Thread: mongoose.model('Thread', ThreadSchema),
      schema: ThreadSchema
    };

}
