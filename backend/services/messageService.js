
'use strict';

module.exports = {
	locals: [
		'utils.logger',
		'daos.threadDao',
	],
	init: init
};

function init(eggnog) {

	var logger = eggnog.import('utils.logger')(__filename);
	var threadDao = eggnog.import('daos.threadDao');

	//// Public API

	eggnog.exports = {
		getMessages: getMessages,
		createMessage: createMessage
	};

	///////////

	function getMessages(threadId, minTimestamp) {
		logger.debug('Getting messages for thread %s since %s', threadId, minTimestamp);
		return threadDao.lookupMessages(threadId, 0);
	}

	function createMessage(threadId, message) {
		logger.debug('Creating message on thread %s', threadId);
		var msg = {
			text: message.text,
			user: message.user,
			timestamp: Date.now()
		};

		return threadDao.createMessage(threadId, msg);
	}

}
