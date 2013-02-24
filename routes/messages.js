
var comb = require('comb');

module.exports = function(cfg) {
	
	var messageService = cfg.services.messageService;
	var app = cfg.app;
	
	
	
	app.get('/thread/:threadId/messages', function(req, res) {
		var threadId = parseInt(req.params.threadId);
		var userId = req.session.user.userId;
		var startTime = req.query.startTime;
		var endTime = req.query.endTime;
		
		messageService.getMessages({
			threadId: threadId,
			userId: userId,
			startTime: startTime,
			endTime: endTime
		}).then(function(messages) {
			res.json(messages);
		});
		
	});
	
	
	app.put('/thread/:threadId/messages', function(req, res) {
		var threadId = parseInt(req.params.threadId);
		var userId = req.session.user.userId;
		var messageText = req.body.text
		
		messageService.createMessage({
			userId: userId,
			threadId: threadId,
			messageText: messageText
		}).then(function(message) {
			if (message) {
				res.json(message);
			} else {
				res.send(400);
			}
		});
		
	});
	
}
