//user.js
//user model
//

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    _id: String,
    displayName: String,
    created: {type: Date, default: new Date()}
});
