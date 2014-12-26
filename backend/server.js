//server.js
//
//BASE SETUP
//
//

module.exports = {
    isMain: true,
    import: [
        'utils.logger',
        'daos.threadDao',
        'services.messageService',
        'services.threadService',
        'services.sessionService',
        'routes.Router',
        'services.threadCacheService',
        'models.user',
    ],
    init: init
}

function init(imports) {
    require('sugar');
    var restify = require('restify');

    //logger
    var logger = imports.get('utils.logger')(__filename);

    // TODO: Call only services, no daos
    var threadDao = imports.get('daos.threadDao');
    var messageService = imports.get('services.messageService');
    var Router = imports.get('routes.Router');
    var sessionService = imports.get('services.sessionService');
    var User = imports.get('models.user');

    //Iinitialize the thread cache
    var threadCache = imports.get('services.threadCacheService')();
    var threadService = imports.get('services.threadService')(threadCache);


    //create config vars --- these should be move to a config.js
    var restServicesPort = 3001;
    var mongoEndpoint = 'mongodb://localhost:27017/derp-ninja';

    //create the server
    var server = restify.createServer();
    server.use(restify.bodyParser());
    var cookieParser = require('restify-cookies');
    server.use(cookieParser.parse);
    server.use(restify.queryParser());
    server.use(restify.requestLogger());

    var router = new Router(server);
    sessionService.init(server);

    //MONGOOSE SETUP
    var mongoose = require('mongoose');
    mongoose.connect(mongoEndpoint);

    router.get(undefined, function(req, res){
        res.send({message: 'this is this the base url for this api, if you are getting this it is probably a mistake'});
    }, {open: true});

    //All paths related to users
    router.post('/user', function(req, res) {
        var user = new User();
        user._id = req.body.username;
        user.password = req.body.password;

        user.save(function(err, user){
            if(err){
                 res.json({message: 'could not save user'});
                 logger.warn('error saving using', err);
            } else {
            	// TODO: Are we automatically logging in the user after this?
            	// Might be better to forward to login
            	// passport.authenticate('local');
            	sessionService.authenticateUserMW();
            	sessionService.login(req, res);
                logger.info('successfully created a new user for %s', user._id);
                res.json({message: 'user created'});
            }

        });
    }, {open: true});



    //All the login paths
    router.post('/login', function(req, res) {
        logger.info('%s is attempting a login', req.params.username);
        sessionService.login(req, res);
        res.json({user: req.user._id, message: 'authenticated'});
    }, {login: true});

    // TODO: Pretty sure we can just remove {open: true} and get the same effect...
    router.get('/login', function(req, res){
    	if (sessionService.isLoggedIn(req)) {
    		res.json({user: 'authenticated'});
    	} else {
    		res.send(401);
    	}
    }, {open: true});

    router.get('/logout', function(req, res){
        sessionService.logout(req);
        res.json({user: 'logged out'});
    }, {open: true});

    //Message threads

    // Create Thread
    router.post('/threads', function(req, res, session){

        threadService
            .createThread(session.getUser()._id, req.body.title, req.body.tags)
            .then(function(thread) {
                res.send(201, thread._id);
            })
            .catch(router.serverError(res));


    });

    //get all threads for a user
    router.get('/threads', function(req, res, session) {
        threadService
            .getThreadsForUser(session.getUser()._id)
            .then(function(threads){
                res.send(201, threads);
            })
            .catch(router.serverError(res));
    });

    // Creae message
    router.post('/thread/:threadId/messages', function(req, res, session) {

    	var user = session.getUser()._id;
    	var threadId = req.params.threadId;

    	var msg = {
    		text: req.body.text,
    		user: user
    	};

    	messageSevice
    		.newMessage(threadId, msg)
    		.then(function() {
    			res.send(201);
    		})
    		.catch(router.serverError(res));
    });

    // Get messages for a thread
    // Provide a parameter 'ts' which is the minimum timestamp
    // If not provided, assumes a default value (all of time maybe?)
    router.get('/thread/:threadId/messages', function(req, res, session) {
    	var threadId = req.params.threadId;
    	var ts = req.query.ts || 0;

    	logger.info('getting messages for thread: ', threadId, ts);

    	messageService
    		.getMessages(threadId, ts)
    		.then(function(msgs) {
    			res.send(msgs);
    		})
    		.catch(router.serverError(res));
    });


    server.listen(restServicesPort, function(){
        console.log('Server started on port: ', restServicesPort);
        logger.info('Server started on port: ', restServicesPort);
    });

}
