//logger.js
// Logger utility class
module.exports = {
    init: init
};

function init() {
    var bunyan = require('bunyan');

    var logSource = true; // Logging source is slow, will want to turn this off eventually

    var logger = function(name) {
        name = name || 'derp-ninja-messaging'
        return bunyan.createLogger({
            name: name,
            src: logSource,
            streams: [
            {
                type: 'rotating-file',
                path: './derp-ninja-messaging.log',
                period: '1d',
                count: 3,
                level: 'trace'
            },
            {
                stream: process.stdout,
                level: 'warn'
            }]
        });
    };

    return logger;
};

