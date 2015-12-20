const express = require('express');
const logger = require('morgan');

const allowCrossDomain = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
};

const clientErrorHandler = (req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
};

const serverErrorHandler = (err, req, res) => {
    res.status(err.status || 500);
    res.json();
};

module.exports =
    express()
        .use(logger('dev'))
        .use(allowCrossDomain)
        .use('/movies', require('./routes/movies'))
        .use(clientErrorHandler)
        .use(serverErrorHandler);
