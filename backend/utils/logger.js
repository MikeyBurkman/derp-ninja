//logger.js
// Logger utility class

var bunyan = require('bunyan');

var logSource = true; // Logging source is slow, will want to turn this off eventually

var logger = bunyan.createLogger({
    name: 'derp-ninja-messaging',
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

module.exports = logger;
