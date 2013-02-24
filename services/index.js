
// Note: All service methods return a comb.Promise object, unless otherwise specified

var configure = function(cfg) {
	
	cfg = {
		db: cfg.db
	};
	
	var userService = require('./users').configure(cfg);
	var threadService = require('./threads').configure(cfg);
	var messageService = require('./messages').configure(cfg);
	
	return {
		userService: userService,
		threadService: threadService,
		messageService: messageService
	};
	
};

module.exports = { configure: configure };
