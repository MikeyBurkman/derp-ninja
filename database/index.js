var config = require('../config'),
	patio = require("patio"), 
	comb = require("comb"), 
	when = comb.when, 
	serial = comb.serial,
	sql = patio.sql;

var ret = new comb.Promise(); // Will be populated later
module.exports = ret.promise();

//set all db name to camelize
patio.camelize = true;
patio.configureLogging();

comb.logger("patio").level = config.db.logLevel;

var DB = patio.createConnection({
	host : config.db.host,
	port : config.db.port,
	type : "pg",
	maxConnections : config.db.maxConnections,
	minConnections : config.db.minConnections
});

var errorHandler = function(error) {
	console.log('Database Error! ', error.stack);
};

var dateToTimeStamp = function(date) {
	return new patio.sql.TimeStamp(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
		date.getHours(),
		date.getMinutes(),
		date.getSeconds()
	);
};

var getPrimaryKeyQualifier = function(model) {
	var pk = model.primaryKey[0];
	return sql[pk].qualify(model.tableName);
};

// Make sure that the database tables are present.
// If not, create them.
// (Currently assumes that all tables are either there or not there. Does not check if the database is in an incomplete state.)
var createTablesIfAbsent = function() {
	var ret = new comb.Promise();
	console.log('Checking existence of database tables');
	DB.from('user').first().then(function(user) {
		// Table was there, we're fine
		ret.callback();
	}, function(err) {
		if (err) {
			console.log('Database tables not found, creating them');
			createTables().then(function() {
				ret.callback();
			});
		}
	});
	return ret;
};

var clearTables = function() {
	console.log('Dropping database tables');
	return DB.forceDropTable(['tag', 'thread_link', 'message', 'thread_member', 'thread', 'user']);
};

var createTables = function() {
	return comb.serial([
		function() {
			return DB.createTable("user", function() {
				this.primaryKey("userId");
				this.name(String, {allowNull: false});
				this.index('name', {unique: true});
			});
		},
	
		function() {
			return DB.createTable("thread", function() {
				this.primaryKey("threadId");
				this.createDate(sql.TimeStamp, {allowNull: false});
				this.name(String, {allowNull: false});
			});
		},
		
		function() {
			return DB.createTable('threadMember', function() {
				this.primaryKey('threadMemberId');
				this.isModerator(Boolean, {allowNull: false});
				this.foreignKey('userId', 'user', {allowNull: false});
				this.foreignKey('threadId', 'thread', {allowNull: false});
				this.index(['userId', 'threadId'], {unique: true});
			});
		},
		
		function() {
			return DB.createTable('message', function() {
				this.primaryKey('messageId');
				this.foreignKey('userId', 'user', {allowNull: false});
				this.foreignKey('threadId', 'thread', {allowNull: false});
				this.date(sql.TimeStamp, {allowNull: false});
				this.text(String, {allowNull: false});
			})
		},
		
		function() {
			return DB.createTable('tag', function() {
				this.primaryKey('tagId');
				this.foreignKey('messageId', 'message', {allowNull: false});
				this.foreignKey('threadId', 'thread', {allowNull: false});
				this.text(String, {allowNull: false});
			})
		},
		
		function() {
			return DB.createTable('threadLink', function() {
				this.primaryKey('threadLinkId');
				this.foreignKey('referenceTo', 'message');
				this.foreignKey('referencedBy', 'message');
				this.date(sql.TimeStamp);
				this.text(String);
			})
		}
	]);

};

var User, Thread, Message, Tag;

var createModels = function() {

	console.log('Creating models');

	Thread = patio.addModel('thread', {
				pre: {
					save: function(next) {
						this.createDate = new Date();
						next();
					}
				}
			})
			.oneToMany('messages')
			.oneToMany('threadMember')
			.manyToMany('users', {joinTable: 'threadMember'});
	console.log('Created Thread model');
	
	User = patio.addModel('user')
			.oneToMany('messages')
			.oneToMany('threadMember')
			.manyToMany('threads', {joinTable: 'threadMember'});
	console.log('Created User model');
			
	ThreadMember = patio.addModel('threadMember')
			.manyToOne('user')
			.manyToOne('thread');
	console.log('Created ThreadMember model');
			
	Message = patio.addModel('message', {
				pre: {
					save: function(next) {
						this.date = new Date();
						next();
					}
				}
			})
			.manyToOne('user')
			.manyToOne('thread');
			//.manyToMany('references', {joinTable: 'thread_link', leftKey: 'referenceTo', rightKey: 'referencedBy'});
	console.log('Created Message model');
			
	Tag = patio.addModel('tag')
			.manyToOne('thread')
			.manyToOne('user');
	console.log('Created Tag model');
			
	console.log('Finished creating models');
};


serial([
	function() {
		if (config.db.rebuildOnStartup) {
			console.info('RebuildDB was true, rebuilding tables');
			return clearTables();
		}
	},
	
	createTablesIfAbsent,
	
	createModels,
	
	function() {
		console.log('Syncing models');
		return patio.syncModels();
	},
	
	function() {
		ret.callback({
			DB : DB,
			models: {
				User: User,
				Thread: Thread,
				ThreadMember: ThreadMember,
				Message: Message,
				Tag: Tag
			},
			util: {
				dateToTimeStamp: dateToTimeStamp,
				getPrimaryKeyQualifier: getPrimaryKeyQualifier
			}
		});
	}

]);
