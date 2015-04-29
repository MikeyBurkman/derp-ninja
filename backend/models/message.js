//message.js
//domain object representing messages within the system
//
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

	var MessageSchema = new Schema({
	    user: {type: String, ref: 'User'},
	    messageText: String,
    	tags: {type:String},
	    created: {type: Date, default: new Date()}
	});

	eggnog.exports = {
		Message: mongoose.model('Message', MessageSchema),
		schema: MessageSchema
	};

}
