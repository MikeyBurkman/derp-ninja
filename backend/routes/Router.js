
module.exports = {
	import: [{
		id: 'utils.logger',
		as: 'log'
	}, {
		id: 'services.sessionService',
		as: 'sessionService'
	}, {
		id: 'models.session',
		as: 'session'
	}],
	init: init
}

function init(imports) {

	var logger = imports.log(__filename);
	var sessionService = imports.sessionService;
	var Session = imports.session;

	return function(server) {

		this.get = request.fill(server, 'get');
		this.post = request.fill(server, 'post');
		this.put = request.fill(server, 'put');
		this.del = request.fill(server, 'del');
		this.serverError = serverError;

		///////////////////

		var baseApi = '/api';

		function createRoutePath(endPoint) {
		    if(endPoint) {
		        return baseApi + endPoint;
		    } else {
		        return baseApi;
		    }
		};

		// opts: {open: true} if no authentication required
		//		 {login: true} if passport.authenticate('local') middleware should be called
		// cb: function(req, res, Session)
		// TODO: Should we allow next() to be called? Requires us to name routes.
		function request(server, method, url, cb, opts) {
			opts = opts || {};

			var endpoint = createRoutePath(url);

			var fn = function(req, res) {
				logger.info('Got request to: ', [method, endpoint]);
				var sess = new Session(sessionService.currentSession(req));
				return cb(req, res, sess);
			};

			var middleware = [];

			if (opts.login) {
				// This route authenticates the user
				middleware.push(sessionService.authenticateUserMW());
			} else if (!opts.open) {
				// This route requires the user to already be authenticated
				middleware.push(sessionService.requireAuthMW());
			}
			// TODO: Add authorization here based on roles passed to opts

			var args = [endpoint, middleware, fn].flatten();
			logger.info('Creating route: ', [method, endpoint, opts]);
			return server[method].apply(server, args);
			
		};

		// Usage service.something().then(...).catch(serverError(res));
		function serverError(res) {
			return function(err) {
				logger.err('error: ', err);
				res.send(500);
			};
		};

	};

}
