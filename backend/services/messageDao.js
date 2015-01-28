//messageDao.js
// Interface to search for and insert new messages
module.exports = {
	imports: [
		'utils.logger',
		'modles.message'
	],
	extImports: [
		'q'
	],
	init: init
}

function init(eggnog) {
	var q = eggnog.import('q');
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

