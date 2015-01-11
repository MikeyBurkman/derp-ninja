//messageDao.js
// Interface to search for and insert new messages
module.exports = {
    getMessages: getMessages,
    addMessage: addMessage,
    deleteMessage: deleteMessage,
    editMessage: editMessage
}

var q = require('q');
var logger = require('../utils/logger');
var Message = require('../models/message');

function getMessages(query) {

}

function addMessage(message, thread ){

}

function deleteMessage(messageId){

}

function editMessage(messageUpdate) {

}
