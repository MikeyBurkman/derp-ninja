// Acts as a wrapper around a generic session object, so code can't arbitrarily attach things to the session
'use strict';

module.exports = {
	init: init
};

function init(eggnog) {

	eggnog.exports = function(session) {

		this.getUser = getAttr.fill('user');
		this.setUser = setAttr.fill('user');

		////////////////

		function setAttr(attr, value) {
			if (!session) {
				throw 'Session not set; cannot set attribute [' + attr + ']';
			}
			session[attr] = value;
		}

		function getAttr(attr) {
		    if (!session) {
				throw 'Session not set; cannot get attribute [' + attr + ']';
			}
		    return session[attr];
		}

	};

}
