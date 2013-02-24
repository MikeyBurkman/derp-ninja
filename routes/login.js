
module.exports = function(cfg) {
	var app = cfg.app;
	var db = cfg.db;
	
	var User = db.models.User;
	
	var login = function(name, callback) {
		console.log('Logging in %s', name);
		User.filter({name: name}).first().then(function(user) {
			if (user) {
				console.log('Found user: ID = %d', user.userId);
				callback(user);
			} else {
				console.log('Found no user for name = %s', name);
				callback(undefined);
			}
		});
	};
	
	app.get('/login', function(req, res) {
		if (req.session && req.session.user) {
			console.log('Session: %j', [req.session]);
			login(req.session.user.name, function(user) {
				if (user) {
					console.log('# User already had session, logging in: %s', user.name);
					res.json(user)
				} else {
					// Session name didn't match one from the database
					req.session = null;
					res.json(null);
				}
			});
			
		} else {
			res.json(null);
		}
	});
	
	app.put('/login', function(req, res) {
		var name = req.body.name;
		login(name, function(user) {
			if (user) {
				req.session.user = user;
				res.json(user);
			} else {
				res.json(null);
			}
		});
	});
	
	app.del('/login', function(req, res) {
		var out = req.session && req.session.user && req.session.user.name;
		console.log('Logging out user:', out);
		req.session = null;
		res.send(200, {success: true});
	});
	
};
