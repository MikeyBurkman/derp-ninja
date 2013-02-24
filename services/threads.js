
var comb = require('comb'),
	patio = require('patio'),
	sql = patio.sql;


var configure = function(cfg) {
	var db = cfg.db;
	
	var Thread = db.models.Thread;
	var ThreadMember = db.models.ThreadMember;
	var User = db.models.User;
	
	var getThread = function(threadId) {
		if (!comb.isNumber(threadId)) {
			throw new Error('Illegal thread ID: ' + threadId);
		}
		return Thread.findById(threadId);
	};
	
	var createThread = function(cfg) {
		var userId = cfg.userId;
		var threadName = cfg.threadName;
		
		if (!comb.isNumber(userId)) {
			throw new Error('Illegal user ID: ' + userId);
		}
		if (!comb.isString(threadName)) {
			throw new Error('Illegal thread name: ' + threadName);
		}
		
		var ret = new comb.Promise();
		
		User.findById(userId).then(function(user) {
			
			Thread.save({
				name: threadName
			}).then(function(thread) {
				console.log('Created thread: ' + thread.threadId);
				user.addThreadMember({
					isModerator: true,
					thread: thread
				}).then(function() {
					ret.callback(thread);
				})
			});
		});
		
		return ret;
		
	};

	var getUsersForThread = function(cfg) {
		
		var userId = cfg.userId;
		var threadId = cfg.threadId;
		
		var ret = new comb.Promise();
		
		/*
		1) Visibility into this thread: 
			select 1 from thread_member where user_id = userId and thread_id = threadId
		2) Get all users for the given thread
			select user.* from user inner join thread_member on user.user_id = thread_member.user_id where thread_member.thread_id = threadId
		*/
			
		ThreadMember.filter({userId: userId, threadId: threadId}).isEmpty().then(function(isEmpty) {
			if (isEmpty) {
				// User is trying to see users for a thread they aren't a member for!
				ret.callback([]);
			} else {
				User.join(ThreadMember, {userId: sql.userId.qualify(User.tableName)})
					.filter(sql.literal('thread_member.thread_id = ?', threadId))
					.map(function(user) {
						return {
							userId: user.userId,
							name: user.name
						}
					}).then(function(users) {
						ret.callback(users);
					}, function(err) {
						console.log('Error! ', err);
					});
			}
			
		});
		
		return ret;
	};
	
	var addUsersToThread = function(cfg) {
		
		var userId = cfg.userId;
		var threadId = cfg.threadId;
		var userIds = cfg.userIds;
		
		if (!comb.isNumber(userId)) {
			throw new Error('Illegal user ID: ' + userId);
		}
		if (!comb.isNumber(threadId)) {
			throw new Error('Illegal thread ID: ' + threadId);
		}
		if (!comb.isArray(userIds) || userIds.isEmpty) {
			throw new Error('Illegal user ID array: ' + userIds);
		}
		
		var ret = new comb.Promise();
		
		ThreadMember.filter({userId: userId, threadId: threadId}).isEmpty().then(function(isEmpty) {
			
			if (isEmpty) {
				// User is trying to add a user for a thread they aren't a member for!
				ret.callback(false);
				
			} else {
				
				// Create new thread member rows for each of the given IDs.
				// TODO: check to make sure they aren't already part of the thread, and that the users exist already
				printf('Addding users %j to thread %d', userIds, threadId);
				
				var toSave = userIds.map(function(userId) {
					return {
						isModerator: false,
						threadId: threadId,
						userId: userId
					}
				});
				
				ThreadMember.save(toSave).then(function() {
					ret.callback(true);
				});
			}
		});
		
		return ret;
	};
	
	var removeUserFromThread = function(cfg) {
		var userId = cfg.userId;
		var threadId = cfg.threadId;
		
		return ThreadMember.remove({userId: userId, threadId: threadId});
		
	};

	return {
		getThread: getThread,
		createThread: createThread,
		getUsersForThread: getUsersForThread,
		addUsersToThread: addUsersToThread,
		removeUserFromThread: removeUserFromThread
	};
	
};

module.exports = { configure: configure };
