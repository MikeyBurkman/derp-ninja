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
                }]
            },
    created: {type: Date, default: new Date()},
    title: String,
    tags: [{type: String}],
    messages: {type:[Message], default: []}    
});

module.exports = mongoose.model('Thread', ThreadSchema);
