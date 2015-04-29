//server.js
//
//BASE SETUP
//
//
'use strict';

module.exports = {
    isMain: true,
    locals: [
        'utils.logger',
        'services.messageService',
        'services.threadService',
        'services.sessionService',
        'services.threadCacheService',
        'routes.Router',
        'models.user',
    ],
    externals: [
        'sugar',
        'bluebird',
        'restify',
        'restify-cookies',
        'mongoose'
    ],
    globals: [
      'console'
    ],
    init: init
};

function init(eggnog) {
  // Just need to import sugar
  eggnog.import('sugar');

  var console = eggnog.import('console');

  var restify = eggnog.import('restify');

  var Promise = eggnog.import('bluebird');
  Promise.longStackTraces();

  var logger = eggnog.import('utils.logger')(__filename);

  var messageService = eggnog.import('services.messageService');
  var Router = eggnog.import('routes.Router');
  var sessionService = eggnog.import('services.sessionService');
  var User = eggnog.import('models.user');

  //Iinitialize the thread cache
  var threadCache = eggnog.import('services.threadCacheService')();
  var threadService = eggnog.import('services.threadService')(threadCache);


  //create config vars --- these should be move to a config.js
  var restServicesPort = 3001;
  var mongoEndpoint = 'mongodb://localhost:27017/derp-ninja';

  //create the server
  var server = restify.createServer();
  server.use(restify.bodyParser());
  var cookieParser = eggnog.import('restify-cookies');
  server.use(cookieParser.parse);
  server.use(restify.queryParser());
  server.use(restify.requestLogger());

  var router = new Router(server);
  sessionService.initServer(server);

  //MONGOOSE SETUP
  var mongoose = eggnog.import('mongoose');
  Promise.promisifyAll(mongoose);
  mongoose.connect(mongoEndpoint);

  router.get(undefined, function(req, res){
    res.send({message: 'this is this the base url for this api, if you are getting this it is probably a mistake'});
  }, {open: true});

  //All paths related to users
  var friendsList = [{name:'George Harrison'}, {name:'Mr. Ripley'}, {name:'Julius Ceasar'}];
  router.get('/user/friend', function(req, res, session) {
    // Totally test code here
    setTimeout(function(){
      if(friendsList['Bruce Lee']) {
        delete friendsList['Bruce Lee'];
      } else {
        friendsList.push({name:'Bruce Lee'});
      }
    }, 10000);
    res.json({friends: friendsList});
  });

  router.post('/users', function(req, res) {
    var user = new User();
    user._id = req.body.username;
    user.password = req.body.password; // yay plaintext passwords!

    return user.saveAsync()
      .then(function(user) {
        // TODO: Are we automatically logging in the user after this?
      	// Might be better to forward to login
      	// passport.authenticate('local');
      	sessionService.authenticateUserMW();
      	sessionService.login(req, res);
        logger.info('successfully created a new user for %s', user._id);
        res.json({message: 'user created'});
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
    return threadService
      .createThread(session.getUser()._id, req.body.title, req.body.tags)
      .then(function(thread) {
          res.send(201, thread._id);
      });
  });

  //get all threads for a user
  router.get('/threads', function(req, res, session) {
    return threadService
      .getThreadsForUser(session.getUser()._id)
      .then(function(threads){
          res.send(201, threads);
      });
  });

  // Create message
  router.post('/threads/:threadId/messages', function(req, res, session) {

  	var user = session.getUser()._id;
  	var threadId = req.params.threadId;

  	var msg = {
  		text: req.body.text,
  		user: user
  	};

  	return messageService
  		.createMessage(threadId, msg)
  		.then(function(thread) {
  			res.send(201, thread[0].messages.last());
  		});
  });

  // Get messages for a thread
  // Provide a parameter 'ts' which is the minimum timestamp
  // If not provided, assumes a default value (all of time maybe?)
  router.get('/threads/:threadId/messages', function(req, res, session) {
  	var threadId = req.params.threadId;
  	var ts = req.query.ts || 0;

  	logger.info('getting messages for thread: ', threadId, ts);

  	return messageService
  		.getMessages(threadId, ts)
  		.then(function(msgs) {
  			res.send(msgs);
  		});
  });


  server.listen(restServicesPort, function(){
    console.log('Server started on port: ', restServicesPort);
    logger.info('Server started on port: ', restServicesPort);
  });

}
