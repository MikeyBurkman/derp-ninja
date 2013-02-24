
var msgs = (function() {
	
	var messageBoxId = '#messageBox';
	var messageInputId = '#messageInput';
	
	var startTime = 0;
	var endTime = (new Date()).getTime();
	var refresh = 5000;
	var timeout = null;
	var resetMessageInput = false;
	
	var getMessages = function() {
		$.ajax({
			url: getMessagesUrl,
			data: {startTime: startTime, endTime: endTime},
			success: function(data) {
				data = {msgs: data};
				$(messageBoxId).append(templates.messages(data));
				startTime = endTime;
				endTime = (new Date()).getTime();
				clearTimeout(timeout);
				timeout = setTimeout(getMessages, refresh);
			}
		});
	};
	// Kick it off
	timeout = setTimeout(getMessages, 0);
	
	// New message function
	var newMessage = function() {
		var text = $(messageInput).val();
		$(messageInput).prop('disabled', true);
		$.ajax({
			url: createMessageUrl,
			type: 'PUT',
			data: {text: text},
			success: function(data) {
				$(messageInputId).val('').prop('disabled', false);
				console.log('posted message successfully');
				if (timeout != null) {
					clearTimeout(timeout);
					timeout = setTimeout(function() {
						endTime = (new Date()).getTime();
						console.log('endTime ', new Date(endTime));
						getMessages();
					}, 1);
				}
			}
		});
	};
	
	return {
		newMessage: newMessage
	};
	
})();
