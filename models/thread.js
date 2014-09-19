//thread.js
//domain object for threads within the system
//
//
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ThreadSchema = new Schema({

});

module.exports = mongoose.model('Thread', ThreadSchema);
