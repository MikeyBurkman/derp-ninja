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

//MONGOOSE SETUP
var mongoose = require('mongoose');
mongoose.connect(mongoEndpoint);

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


server.listen(restServicesPort, function(){
    console.log('Server started');
});
