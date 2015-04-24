
'use strict';

module.exports = {
	locals: [
		'utils.logger',
		'daos.threadDao',
	],
	externals: [
		'bluebird'
	],
	init: init
};

function init(eggnog) {

	var Promise = eggnog.import('bluebird');

	var logger = eggnog.import('utils.logger')(__filename);
	var threadDao = eggnog.import('daos.threadDao');

	// In-memory threads, used as a cache
	var threads = {};

	//// Public API

	eggnog.exports = {
		getMessages: getMessages,
		createMessage: createMessage
	};

	///////////

	function getMessages(threadId, minTimestamp) {
		return threadDao.lookupMessages(threadId, 0);
	}

	function createMessage(threadId, message) {
		var msg = {
			text: message.text,
			user: message.user,
			timestamp: Date.now()
		};

		return threadDao.createMessage(threadId, msg);
	}

	// Todo: Messages for any thread should always be a promise
	// When populating a thread's message, that promise should be replaced by a new one

	// TODO: Prune old messages from in-memory threads occasionally and update minTimestamp
	// Delete threads if no more messages
	// Can also delete threads that haven't been accessed in a while

	// Get all messages for the given thread whose timestamp >= minTimestamp
	function _getMessages(threadId, minTimestamp) {

		var thread = getThread(threadId);

		thread.lastAccess = Date.now();

		if (minTimestamp < thread.minTimestamp) {
			// We may have older messages in the database than we do in memory.
			// Look up any messages dating back to minTimestamp.
			// Right now we bring back ALL messages for the thread, though we could
			//	instead look up only messages in the timeframe we're missing.
			return lookupMessages(threadId, minTimestamp)
				.then(function(msgs) {
					thread.messages = msgs;
					thread.minTimestamp = minTimestamp;
					return thread.messages;
				});
		}

    // We should have everything in cache
		var msgs = [];

		for (var i = 0; i < thread.messages.length; i += 1) {
			var m = thread.messages[i];
			if (m.timestamp >= minTimestamp) {
				msgs.push(m);
			} else {
				// Messages are ordered, so messages after this will have a timestamp after the argument
				break;
			}

			return Promise.resolve(msgs);
		}

	}

	function _createMessage(threadId, message) {
		var thread = getThread(threadId);

		var msg = {
			text: message.text,
			user: message.user,
			timestamp: Date.now()
		};

		// Push to DB
		return saveMessage(threadId, msg)
			.then(function(savedMessage) {
				// Push to local memory.
				// We could probably write to memory first, and async write to DB
				if (thread.messages.length === 0) {
					// Empty thread, so
					thread.minTimestamp = msg.timestamp;
				}
				thread.messages.push(msg);
				thread.lastAccess = Date.now();

				return savedMessage;
			});
	}

	// local
	function getThread(threadId) {
		var t = threads[threadId];

		if (!t) {
			// Invariant: for all values in messages, no value has timestamp > minTimestamp
			t = threads[threadId] = {
				lastAccess: Date.now(),
				minTimestamp: 4294967295, // MAX_INT -- update after looking up messages
				messages: [] // Messages in order from newest to oldest, going back to minTimestamp
			};
		}

		return t;
	}

	function lookupMessages(threadId, minTimestamp) {
		return threadDao.lookupMessages(threadId, minTimestamp);
	}

	function saveMessage(threadId, message) {
		return threadDao.createMessage(threadId, message);
	}

}
