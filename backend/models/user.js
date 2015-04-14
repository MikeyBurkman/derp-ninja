//user.js
//user model
//

module.exports = {
	externals: [
		'mongoose'
	],
	init: init
}

function init(eggnog) {
	var mongoose = eggnog.import('mongoose');
	var Schema = mongoose.Schema;

	var UserSchema = new Schema({
	    _id: String,
	    displayName: String,
	    password: String,
	    created: {type: Date, default: new Date()}
	});

	eggnog.exports = mongoose.model('User', UserSchema);

}
