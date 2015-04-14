
module.exports = {
    imports: [
        'utils.logger',
        'models.user'
    ],
    extImports: [
        'passport',
        'passport-local',
        'node-uuid'
    ],
    init: init
}

function init(eggnog) {

    var passport = eggnog.import('passport');
    var LocalStrategy = eggnog.import('passport-local').Strategy;
    var uuid = eggnog.import('node-uuid');

    ////////////////////

    // Could break out authentication and sessions into separate services
    var logger = eggnog.import('utils.logger')(__filename);

    //MODELS
    var User = eggnog.import('models.user');

    ////////////////////

    //set up the basic session storage we are using
    // Could break out authentication and sessions into separate services
    var sessionStorage = {};

    //SET UP PASSPORT FOR AUTHENTICATION
    passport.use(new LocalStrategy(function(username, password, done){
        logger.info('Looking up user: ', username);
        User.findOne({'_id': username}).exec()
            .then(function(user){;
                if(user.password === password){
                   return done(null, user);
                } else {
                    logger.info(username, ' has logged in');
                    return done(null, false, {message: 'Incorrect password'});
                }
            }, function(err){
                return done(null, false, {message: 'bad username'});
            });
    }));

    passport.serializeUser(function(user, done){
        done(null, user);
    });

    passport.deserializeUser(function(user, done){
        done(null, user);
    });

    eggnog.exports = {
        init: init,
        login: login,
        logout: logout,
        isLoggedIn: isLoggedIn,
        currentSession: currentSession,
        currentUser: currentUser,
        requireAuthMW: requireAuthMW,
        authenticateUserMW: authenticateUserMW
    };


    function currentSession(req) {
        var sessionId = req.cookies.session;
        if (sessionId) {
            return sessionStorage[sessionId];
        } else {
            return undefined;
        }
    };

    function removeSession(req) {
        var sessionId = req.cookies.session;
        if (sessionId) {
            delete sessionStorage[sessionId];
        }
    }

    function sessionAttr(req, attr) {
        var session = currentSession(req) || {};
        return session[attr];
    };

    function login(req, res) {
        var sessionId = uuid.v1();
        var session = sessionStorage[sessionId] = {
            user: req.user
        }
        req.cookies.session = session;
        res.setCookie('session', sessionId);
    };

    function isLoggedIn(req) {
        return !!sessionAttr(req, 'user');
    };

    function logout(req) {
        logger.info('logging user out');
        removeSession(req);
    }

    function currentUser(req) {
        return sessionAttr(req, 'user');
    };

    function init(server) {
        server.use(passport.initialize());
        server.use(passport.session());
    };

    function authenticateUserMW() {
        return passport.authenticate('local');
    };

    function requireAuthMW() {
        return function(req, res, next) {
            // TODO: if isLoggedIn(req)?
            if (currentSession(req)) {
                next();
            } else {
                res.send(401);
            }
        };
    };
}

