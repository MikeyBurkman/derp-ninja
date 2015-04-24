//messageDao.js
// Interface to search for and insert new messages

'use strict';

module.exports = {
	locals: [
		'utils.logger',
		'modles.message'
	],
	init: init
};

function init(eggnog) {
	var logger = eggnog.import('utils.logger');
	var Message = eggnog.import('models.message');

	eggnog.exports = {
		getMessages: getMessages,
    addMessage: addMessage,
    deleteMessage: deleteMessage,
    editMessage: editMessage
	};

	function getMessages(query) {

	}

	function addMessage(message, thread ){

	}

	function deleteMessage(messageId){

	}

	function editMessage(messageUpdate) {

	}

}
