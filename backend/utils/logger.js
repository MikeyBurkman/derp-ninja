//logger.js
// Logger utility class

var bunyan = require('bunyan');
var logger = bunyan.createLogger({
    name: 'derp-ninja-messaging',
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

module.exports = logger;
