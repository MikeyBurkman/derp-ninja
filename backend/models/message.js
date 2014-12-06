//message.js
//domain object representing messages within the system
//
//



var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    user: {type: String, ref: 'User'},
    messageText: String,
    tags: [type:String],
    created: {type: Date, default: new Date()}
});


module.exports = MessageSchema;
