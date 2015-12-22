const config = require('./config/main.json');
const connectDb = require('./db');
const startHttpServer = require('./http');
const api = require('./api');

Promise
    .all([
        connectDb(config.db),
        startHttpServer(api, config.http),
    ])
    .catch(() => process.exit(1));
