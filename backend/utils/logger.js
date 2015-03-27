//logger.js
// Logger utility class
module.exports = {
    init: init,
    extImports: [
        'bunyan'
    ]
};

function init(eggnog) {
    var bunyan = eggnog.import('bunyan');

    eggnog.exports = logger;

    var logSource = true; // Logging source is slow, will want to turn this off eventually

    function logger(name) {
        // If logging source, the name is redundant, so don't include it
        var name = logSource ? ' ' : (name || 'derp-ninja-messaging');
        return bunyan.createLogger({
            name: name,
            src: logSource,
            streams: [
            {
                type: 'rotating-file',
                path: './logs/derp-ninja-messaging.log',
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

};

