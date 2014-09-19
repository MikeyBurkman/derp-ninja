//server.js
//
//BASE SETUP
//
//
var restify = require('restify');

//create the server
var server = restify.createServer();



//MONGOOSE SETUP
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/derp-ninja');


