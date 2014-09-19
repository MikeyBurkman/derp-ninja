//message.js
//domain object representing messages within the system
//
//



var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({


});

module.exports = mongoose.model('Message', MessageSchema);
