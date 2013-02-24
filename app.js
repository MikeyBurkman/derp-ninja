
/**
 * The big one.
 */


var config = require('./config')
  , express = require('express')
  , app = express()
  , comb = require('comb')
  , database = require('./database');

// Replace the regular console.log function with one that prints out the date.
var oldLog = console.log;
console.log = function() {
	var theTime = new Date().toString() + ': ';
	if (comb.isString(arguments[0])) {
		arguments[0] = theTime + arguments[0];
	} else {
		arguments = Array.prototype.concat.apply([theTime], arguments);
	}
    oldLog.apply(console, arguments);
};

database.then(function(db) {
	
	console.log('Database Ready');
		
		// Configuration
	var sessionParams = {
		key: config.session.key,
		secret: config.session.secret,
		maxAge: config.session.maxAge
	};
	
	app.configure(function(){
	  app.set('views', __dirname + '/views');
	  app.set('view engine', 'jade');
	  app.use(express.cookieParser());
	  app.use(express.cookieSession(sessionParams));
	  app.use(express.bodyParser());
	  app.use(express.methodOverride());
	  app.use(app.router);
	  app.use(express.static(__dirname + '/public'));
	});
	
	app.configure('development', function(){
	  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
	  app.locals.pretty = true;
	});
	
	app.configure('production', function(){
	  app.use(express.errorHandler()); 
	});
	
	var services = require('./services').configure({
		db: db
	});
	
	console.log('services = ', services);
	
	// Routes
	require('./routes').configure({
		db: db, // To be removed after everything is in a service
		services: services,
		app: app
	});
	
	app.listen(config.connection.port);
	console.log("Express server listening in [%s] mode on port [%d]", app.settings.env, config.connection.port);
	
});

