
(function() {

var ajax = function(cfg) {
	var data = cfg.data;
	if (cfg.type == 'POST' || cfg.type == 'PUT') {
		data = JSON.stringify(data);
	}
	return $.ajax({
		url: cfg.url,
		type: cfg.type,
		data: data,
		contentType: 'application/json; charset=utf-8',
		dataType: 'json'
	});
};

window.Message = function(text) {
	var self = this;
	this.text = ko.observable(text);
};

window.Thread = function(thread) {
	console.log('Thread = ', thread);
	var self = this;
	self.id = ko.observable(thread.threadId);
	self.createDate = ko.observable(thread.createDate);
	self.threadName = ko.observable(thread.name);
	self.messages = ko.observableArray([]);
	
	self.latestMsg = ko.computed(function() {
		if (self.messages().length > 0) {
			return self.messages()[0].text();
		} else {
			return '<Empty>';
		}
	});
	
	console.log('Created thread: ', self);
};

window.OpenedThread = function(baseThread) {
	var self = this;
	self.baseThread = baseThread;
	self.newMsgText = ko.observable();
	
	self.addMessage = function() {
		console.log('new message! ', self.newMsgText())
		var msg = new Message(self.newMsgText());
		self.baseThread.messages.push(msg);
		self.newMsgText(null);
	};
	
	self.close = function() {
		// Not sure I like this very much
		dataModel.user().openThreads.remove(this);
	};
};

window.User = function(user) {
	var self = this;
	self.userId = ko.observable(user.userId);
	self.name = ko.observable(user.name);
	self.threads = ko.observableArray([]);
	
	self.openThreads = ko.observableArray([]);
	self.focusedThread = ko.observable();
	
	self.newThreadName = ko.observable();
	
	self.createThread = function() {
		var data = {
			name: self.newThreadName()
		};
		
		self.newThreadName(null);
		
		ajax({
			type: 'PUT',
			url: '/threads',
			data: data
		}).done(function(thread) {
			if (thread) {
				self.threads.push(new Thread(thread));
			}
		});
		
	};
	
	self.openThread = function(thread) {
		console.log('Opening! ', thread);
		var found = ko.utils.arrayFirst(self.openThreads(), function(t) {
			return thread.threadId() == t.baseThread.threadId();
		});
		
		console.log('Found = ', found);
		
		if (!found) {
			self.openThreads.push(new OpenedThread(thread));
		}
		
		self.focusedThread(found);
	};
	
	self.lookupThreads = function() {
		$.getJSON('/user/' + self.userId() + '/threads', function(threads) {
			if (threads) {
				ko.utils.arrayForEach(threads, function(thread) {
					self.threads.push(new Thread(thread));
				});
			}
		});
	};
	
	self.closeThread = function(openThread) {
		self.openThreads.remove(openThread);
		
	};
	
	
	// Init
	if (self.userId() != undefined) {
		self.lookupThreads();
	}
	
};

window.LoginInfo = function() {
	var self = this;
	self.username = ko.observable();
	self.password = ko.observable();
	self.invalidName = ko.observable();
	
	self.invalidate = function() {
		self.invalidName(self.username());
	};
	
	self.loggedIn = function() {
		self.invalidName(null);
	}
};

window.App = function() {
	var self = this;
	
	self.user = ko.observable();
	self.loginInfo = new LoginInfo();
	
	self.logIn = function() {
		var data = {
			name: self.loginInfo.username()
		};
		
		ajax({
			url: '/login',
			type: 'PUT',
			data: data
		}).done(function(user) {
			if (user) {
				self.user(new User(user));
				self.loginInfo.loggedIn();
			} else {
				self.loginInfo.invalidate();
			}
		});
		
	};
	
	self.logOut = function() {
		ajax({
			url: '/login',
			type: 'DELETE'
		}).done(function() {
			console.log('Logged out!');
			self.user(null);
		});
	};
	
	self.createUser = function() {
		var data = {
			name: self.loginInfo.invalidName()
		};
		ajax({
			type: 'PUT',
			url: '/users',
			data: data
		}).done(function(user) {
			if (user) {
				self.user(new User(user));
				self.loginInfo.loggedIn();
			}
		});
	};
	
	self.isLoggedIn = ko.computed(function() {
		return !!self.user();
	});
	
};

})();
