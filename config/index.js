

module.exports = {

	connection: {
		port: 3000
	},
	
	session: {
		key: 'sessionid',
		secret: 'mikerocks',
		maxAge: undefined
	},

	db: {
		rebuildOnStartup: false,
		host: 'localhost',
		port: 5432,
		minConnections: 1,
		maxConnections: 1,
		user: undefined,
		password: undefined,
		logLevel: 'warn'
	}
	
};
