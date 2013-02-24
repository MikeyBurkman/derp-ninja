
var comb = require('comb'),
	patio = require('patio'),
	sql = patio.sql;


var configure = function(cfg) {
	var db = cfg.db;
	
	var Message = db.models.Message;
	var Thread = db.models.Thread;
	var ThreadMember = db.models.ThreadMember;
	
	var getMessages = function(cfg) {
		var threadId = cfg.threadId;
		var userId = cfg.userId;
		var startTime = cfg.startTime;
		var endTime = cfg.endTime;
		
		if (startTime) {
			startTime = new Date(parseInt(startTime));
		} else {
			startTime = new Date(0);
		}
		
		if (endTime) {
			endTime = new Date(parseInt(endTime));
		} else {
			endTime = new Date();
		}
		
		console.log('Getting messages for thread %d, user %d, and times %s - %s', threadId, userId, startTime, endTime);
		
		startTime = db.util.dateToTimeStamp(startTime);
		endTime = db.util.dateToTimeStamp(endTime);
		
		
		// Need to specify WHICH threadID we're referencing in the filter, so it's a little complicated
		// Specify Thread.threadId to our threadId variable
		var messagePartOfOurThread = [[sql.threadId.qualify(ThreadMember.tableName), threadId]];
		var messageVisibleByUser = [[sql.userId.qualify(ThreadMember.tableName), userId]];
		
		var ret = new comb.Promise();
		
		// Get all messages for the given thread and time
		Message
			.join(ThreadMember, [[sql.threadId, sql.threadId.qualify(Message.tableName)]])
			.filter(messagePartOfOurThread)
			.filter(messageVisibleByUser)
			.filter({date: {between: [startTime, endTime]}})
			.order('date')
			.map(function(message) {
				var mapRet = new comb.Promise();
				message.user.then(function(user) {
					mapRet.callback({
						text: message.text,
						date: message.date,
						from: user.name
					});
				});
				return mapRet.promise();
			}).then(function(messages) {
				console.log('Found %d messages!', messages.length);
				ret.callback(messages);
			});
		
		return ret;
		
	};
	
	var createMessage = function(cfg) {
		var userId = cfg.userId;
		var threadId = cfg.threadId;
		var messageText = cfg.messageText;
		
		var ret = new comb.Promise();
		
		Thread.findById(threadId).then(function(thread) {
			if (thread) {
				
				Message.save({
					userId: userId,
					threadId: threadId,
					date: new Date(),
					text: messageText
				}).then(function(message) {
					ret.callback(message);
				})
			} else {
				ret.callback(false);
			}
		});
		
	};
	
	
	return {
		getMessages: getMessages,
		createMessage: createMessage
	};

};

module.exports = { configure: configure };
