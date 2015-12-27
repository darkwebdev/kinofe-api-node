const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = (db) =>
    new Promise((resolve, reject) => {
        mongoose.connect(db);

        return mongoose.connection
            .on('error', (err) =>
                reject(console.error('DB connection error:', err.message)))
            .once('open', () =>
                resolve(console.log(db + ' connected')));
    });
