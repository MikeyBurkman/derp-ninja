//thread.js
//domain object for threads within the system
//
//
var mongoose = require('mongoose');
var Message = require('./message');
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
    messages: {type:[Message], default: []}    
});

ThreadSchema.path('users').validate(function(users) {
    return users.length != 0;
});



module.exports = mongoose.model('Thread', ThreadSchema);
