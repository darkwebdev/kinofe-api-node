const http = require('http');
const _ = require('lodash');

module.exports = (app, config) =>
    new Promise((resolve, reject) => {
        app.set('port', config.port);

        http.createServer(app)
            .listen(config.port)
            .on('error', (err) =>
                reject(onError(err, config.port)))
            .on('listening', () =>
                resolve(console.log('HTTP server listening on port ' + config.port)));
    });

const onError = (error, port) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const codeHandlers = {
        EACCES: () =>
            console.error('Port ' + port + ' requires elevated privileges'),
        EADDRINUSE: () =>
            console.error('Port ' + port + ' is already in use'),
        default: () => {
            throw error;
        }
    };

    _.result(codeHandlers, error.code, codeHandlers.default);
};
