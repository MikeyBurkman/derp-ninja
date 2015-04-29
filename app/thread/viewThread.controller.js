(function(){
  'use strict';

  angular
		.module('app.thread')
    .controller('ViewThreadController', controllerImpl);

  controllerImpl.$inject = ['messages','ThreadService'];

  function controllerImpl(thread, ThreadService) {
    var vm = this;
    vm.threadTitle = thread.title;
    vm.messages = thread.messages;

    vm.addMessageAction = addMessageAction;
    vm.addMessage = {};

    /////////

    function addMessageAction() {
      ThreadService
        .createMessage(vm.addMessage, thread._id)
        .then(function(message){
          vm.addMessage = {};
          console.log(message);
          vm.messages.push(message);
        });
    }
  }

})();
