
module.exports = function(cfg) {
	var threadService = cfg.services.threadService;
	var app = cfg.app;
	
	// Create a thread, with the currently-logged in user being the only member, as well as being a moderator
	app.put('/threads', function(req, res) {
		var threadName = req.body.name;
		var userId = req.session.user.userId;
		console.log('Creating new thread with name: %s', threadName);
		threadService.createThread({
			userId: userId,
			threadName: threadName
		}).then(function(thread) {
			res.json(thread);
		});
	});
	
	// Retrieves the given thread, though no messages (yet)
	app.get('/thread/:threadId', function(req, res) {
		var threadId = parseInt(req.params.threadId);
		
		threadService.getThread(threadId).then(function(thread) {
			if (thread) {
				res.render('thread', {
					thread: {
						threadId: threadId,
						name: thread.name
					}
				});
			} else {
				res.send(404);
			}
		});
	});
	
	// Get the users listening in on the given thread
	app.get('/thread/:threadId/users', function(req, res) {
		var threadId = parseInt(req.params.threadId);
		var userId = req.session.user.userId;
		
		threadService.getUsersForThread({
			threadId: threadId,
			userId: userId
		}).then(function(users) {
			res.json(users);
		});
	});
	
	// Add (non-moderator) users to the given thread
	// The body must contain a JSON object containing a "users" array. This array is a list of userIds.
	app.put('/thread/:threadId/users/', function(req, res) {
		var threadId = parseInt(req.params.threadId);
		var userId = req.session.user.userId;
		var userIds = req.body.users;
		
		theradService.addusersToThread({
			userId: userId,
			threadId: threadId,
			userIds: userIds
		}).then(function(success) {
			if (success) {
				res.send(201, {success: true});
			} else {
				res.send(400);
			}
		});
	});
	
	app.del('/thread/:threadId/users/:userId', function(req, res) {
		// TODO Implement this
		res.send(401);
	});
};
