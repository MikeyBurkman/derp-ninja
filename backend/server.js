//server.js
//
//BASE SETUP
//
//
require('sugar');
var restify = require('restify');

// TODO: Call only services, no daos
var threadDao = require('./daos/threadDao');
var messageService = require('./services/messageService');


//create config vars --- these should be move to a config.js
var restServicesPort = 3001;
var mongoEndpoint = 'mongodb://localhost:27017/derp-ninja';

//create the server
var server = restify.createServer();
server.use(restify.bodyParser());
var cookieParser = require('restify-cookies');
server.use(cookieParser.parse);
server.use(restify.queryParser());

var Router = require('./routes/Router');
var router = new Router(server);
var sessionService = require('./services/sessionService');
sessionService.init(server);

//MONGOOSE SETUP
var mongoose = require('mongoose');
mongoose.connect(mongoEndpoint);


router.get(undefined, function(req, res){
    res.send({message: 'this is this the base url for this api, if you are getting this it is probably a mistake'});
}, {open: true});

//All paths related to users
var User = require('./models/user');
router.post('/user', function(req, res) {
    var user = new User();
    user._id = req.body.username;
    user.password = req.body.password;

    user.save(function(err, user){
        if(err){
             res.json({message: 'could not save user'});
             console.log('error saving using', err);
        } else {
        	// TODO: Are we automatically logging in the user after this?
        	// Might be better to forward to login
        	// passport.authenticate('local');
        	sessionService.authenticateUserMW();
        	sessionService.login(req, res);
            res.json({message: 'user created'});
        }

    });
}, {open: true});



//All the login paths
router.post('/login', function(req, res){
    console.log(req.user._id + " has been successfully authenticated, creating session");
    sessionService.login(req, res);
    res.send(req.user);
}, {login: true});

// TODO: Pretty sure we can just remove {open: true} and get the same effect...
router.get('/login', function(req, res){
	if (sessionSerivce.isLoggedIn()) {
		res.json({user: 'authenticated'});
	} else {
		res.send(401);
	}
}, {open: true});


//Message threads

// Create Thread
router.post('/threads', function(req, res, session){
    var userEntry = {
    	user: session.getUser()._id,
    	createdThread: true
    };
    
    var thread = {
    	users: [userEntry],
    	title: req.body.title,
    	tags: req.body.tags || []
    };

    threadDao
    	.createThread(userEntry, thread)
    	.then(function(thread) {
	    	res.send(thread);
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

	console.log('getting messages for thread: ', threadId, ts);

	messageService
		.getMessages(threadId, ts)
		.then(function(msgs) {
			res.send(msgs);
		})
		.catch(router.serverError(res));
});




server.listen(restServicesPort, function(){
    console.log('Server started on port: ', restServicesPort);
});
