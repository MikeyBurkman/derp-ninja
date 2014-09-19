//thread.js
//domain object for threads within the system
//
//
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ThreadSchema = new Schema({
    users: {type: [{
                user: {type: String, ref: 'User'},
                joined:
                last_view: {type: String, ref: 'Message'}
                }]
            },
    created:
    title:
    tags:               
});

module.exports = mongoose.model('Thread', ThreadSchema);
