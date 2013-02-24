
var comb = require('comb');

var configure = function(cfg) {
	var db = cfg.db;
	
	var User = db.models.User;
	
	var getUser = function(userId) {
		if (!comb.isNumber(userId)) {
			throw new Error('Illegal user ID: ' + userId);
		}
		return User.findById(userId);
	};
	
	var createUser = function(cfg) {
		var name = cfg.name;
		
		if (!comb.isString(name)) {
			throw new Error('Illegal user name: ' + name);
		}
		
		var user = {
			name: name
		};
		
		return User.save(user);
	};
	
	
	return {
		getUser: getUser,
		createUser: createUser
	};
}




module.exports = { configure: configure };
