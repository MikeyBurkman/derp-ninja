//user.js
//user model
//

'use strict';

module.exports = {
	externals: [
		'mongoose'
	],
	init: init
};

function init(eggnog) {
	var mongoose = eggnog.import('mongoose');
	var Schema = mongoose.Schema;

	var UserSchema = new Schema({
	    _id: String,
	    displayName: String,
	    password: String,
	    created: {type: Date, default: new Date()}
	});

	eggnog.exports = {
		User: mongoose.model('User', UserSchema),
		schema: UserSchema
	};

}
