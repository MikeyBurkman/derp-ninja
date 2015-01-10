//user.js
//user model
//

module.exports = {
	init: init
}

function init(imports) {
	var mongoose = require('mongoose');
	var Schema = mongoose.Schema;

	var UserSchema = new Schema({
	    _id: String,
	    displayName: String,
	    password: String,
	    created: {type: Date, default: new Date()}
	});

	return mongoose.model('User', UserSchema);

}