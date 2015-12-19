const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = require('./config/main.json').db;

mongoose.connect(db);

module.exports = new Promise((resolve, reject) =>
    mongoose.connection
        .on('error', (err) =>
            reject(console.error('DB connection error:', err.message)))
        .once('open', () =>
            resolve(console.log(db + ' connected')))
);
