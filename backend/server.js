//server.js
//
//BASE SETUP
//
//
var restify = require('restify');


//create config vars --- these should be move to a config.js
var baseApi = '/api/';
var restServicesPort = 3000;
var mongoEndpoint = 'mongodb://localhost:27017/derp-ninja';

//create the server
var server = restify.createServer();
server.use(restify.bodyParser());
var cookieParser = require('restify-cookies');
server.use(cookieParser.parse);


//set up the basic session storage we are using
var uuid = require('node-uuid');
var sessionStorage = {};

//MONGOOSE SETUP
var mongoose = require('mongoose');
mongoose.connect(mongoEndpoint);


//MODELS
var User = require('./models/user');

//SET UP PASSPORT FOR AUTHENTICATION
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(function(username, password, done){
    var userPromise = User.findOne({'_id': username}).exec();

    userPromise
        .then(function(user){
            if(user.password == password){
                done(null, user);
            } else {
                done(null, false, {message: 'Incorrect password'});
            }
        }, function(err){
            done(null, false, {message: 'bad username'});
        });
}));

passport.serializeUser(function(user, done){
    done(null, user);
});

passport.deserializeUser(function(user, done){
    done(null, user);
});

var authenticate = function(req, res, next){
    var session = sessionStorage[req.cookies.session];
    if(session){
        next();
    } else {
        res.send(401);
    }
};

server.use(passport.initialize());
server.use(passport.session());

var baseApi = '/api/';

function createRoutePath(endPoint) {
    if(endPoint) {
        return baseApi + endPoint;
    } else {
        return baseApi;
    }
}

server.get(createRoutePath(), function(req, res){
    res.send({message: 'this is this the base url for this api, if you are getting this it is probably a mistake'});
});

//All paths related to users
var User = require('./models/user');
server.post(createRoutePath('/user'), function(req, res){
    var user = new User();
    user._id = req.body.username;
    user.password = req.body.password;

    user.save(function(err, user){
        if(err){
             res.json({message: 'could not save user'});
             console.log(err);
        } else {
            passport.authenticate('local');
            res.json({message: 'user created'});
        }

    });
});


//All the login paths
server.post(createRoutePath('/login'), passport.authenticate('local'), function(req, res){
    console.log(req.user._id + " has been successfully authenticated, creating session");
    var sessionId = uuid.v1();
    sessionStorage[sessionId] = req.user._id;
    res.setCookie('session', sessionId);    
    res.send(req.user);
});

server.get(createRoutePath('/login'), function(req, res){
    var sessionId = req.cookies.session;
    var user = sessionStorage[sessionId];
    console.log(sessionStorage);
    if(user) res.json({user: 'authenticated'});
    res.send(401);
});


//Message threads
var MessageThread = require('./models/thread');
server.post(createRoutePath('/thread'), authenticate, function(req, res){
    var userNameCreated = sessionStorage[req.cookies.session];
    var userEntry = {};
    userEntry.user = userNameCreated;
    userEntry.createdThread = true;

    var thread = new MessageThread();
    
    thread.users = [];
    thread.users.push(userEntry);
    thread.title = req.body.title;
    thread.tags = req.body.tags;
    
    thread.save(function(err, thread){
        if(err){
            res.json({message: 'could not create thread'});i
            console.log(err);
        } else {
            res.send(thread);
        }
    });    

});

var Message = require('./models/message');
server.post(createRoutePath('/message'), authenticate, function(req, res){
    var user = sessionStorage[req.cookies.session];
    var threadId = req.body.thread;

    MessageThread.findOne({_id:threadId}).exec()
        .then(function(thread){
            var message = new Message();
            message.user = user;
            message.messageText = req.body.text;
            thread.messages.push(message);
            thread.save(function(err, thread){
                if(err) res.json({message: 'unable to save message'});
                res.send(thread);
            });
        }, function(err){
            res.json({message: 'error retrieving the thread'});
            console.log(err);
        });
});




server.listen(restServicesPort, function(){
    console.log('Server started');
});
