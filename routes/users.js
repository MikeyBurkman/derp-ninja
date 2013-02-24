module.exports = function(cfg) {
	var userService = cfg.services.userService;
	var app = cfg.app;
	
	app.get('/user/:userId', function(req, res) {
		var userId = parseInt(req.params.userId);
		userService.getUser(userId).then(function(user) {
			if (user) {
				res.json(user);
			} else {
				res.send(404);
			}
		});
	});
	
	app.get('/user/:userId/threads', function(req, res) {
		var userId = parseInt(req.params.userId);
		if (req.session && req.session.user && req.session.user.userId == userId) {
			// Find all threads associated with this user
			userService.getUser(userId).then(function(user) {
				if (user) {
					console.log('Found user: %d: %s', user.userId, user.name);
					user.threads.then(function(threads) {
						threads = threads || [];
						res.json(threads);
					});
				} else {
					res.send(404);
				}
			});
		} else {
			res.send(401);
		}
	});
	
	app.put('/users', function(req, res) {
		var name = req.body.name;
		userService.createUser({
			name: name
		}).then(function(user) {
			console.log('Created new user: ', {
				userId: user.userId,
				name: user.name
			});
			req.session.user = user;
			res.json(user);
		});
	});
}
