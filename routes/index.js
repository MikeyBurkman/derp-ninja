
var fs = require('fs');

var configure = function(cfg) {
	var app = cfg.app;
	var db = cfg.db;
	var services = cfg.services;
	
	// Currently it's essentially a copy of the original config, but it's easier to see what the object is this way...
	cfg = {
		app: app,
		db: db,
		services: services
	};
	
	require('./login')(cfg);
	require('./threads')(cfg);
	require('./users')(cfg);
	require('./messages')(cfg);
	
	// Redirect to the homepage
	app.get('/', function(req, res) {
		res.redirect('/index.html');
	});
	
	// Create template serving pages
	app.get('/templates.js', (function() {
		
		var cache = {};
		var getCacheKey = function(tname, ts) {
			return tname + '_' + ts.join('_');
		};
		
		var buildTemplates = function(tname, ts, callback) {
			var output = {};
			var count = 0;
			ts.forEach(function(template) {
				fs.readFile('views/partials/' + template + '.jade', function(err, data) {
					if (err) {
						console.error('Error looking up template: ', err);
						callback({error: 'Could not find template: ' + template});
					} else {
						output[template] = ['jade.compile(', JSON.stringify('' + data), ')'].join('');
						count += 1;
						if (count >= ts.length) {
							var op = [];
							for (var tem in output) {
								op.push(tem + ': ' + output[tem]);
							}
							callback(undefined, tname + ' = {' + op.join(',\n') + '};');
						}
					}
				})
			});
		};
		
		
		var getTemplateFromCache = function(tname, ts, callback) {
			var cacheKey = getCacheKey(tname, ts);
			if (cache[cacheKey]) {
				printf('Using template cache for %s', cacheKey);
				callback(undefined, cache[cacheKey]);
			} else {
				buildTemplates(tname, ts, function(err, data) {
					if (!err) {
						cache[cacheKey] = data;
					}
					callback(err, data);
				});
			}
		};
		
		return function(req, res) {
			var ts = req.query.t;
			var templatesName = req.query.templatesName || 'templates';
			if (!(ts instanceof Array)) {
				ts = [ts];
			}
			
			getTemplateFromCache(templatesName, ts, function(err, data) {
				if (err) {
					res.send(400, err.error);
				} else {
					res.send(data);
				}
			});
		};
	})());
	
	
	// And create error pages
	// Default
	app.use(function(req, res) {
		res.status(404);
		res.render('404');
	});
	
}

module.exports = {
	configure: configure
};
