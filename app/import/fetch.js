const fetch = require('node-fetch');

const config = require('../config/main.json');
const keys = require('../config/keys.json');
const providers = require('./providers');
const { convertListToSchema, convertDetailsToSchema } = require('./converters');

module.exports.fetchNewReleases = () => {
    const provider = providers[config.newReleasesProvider];
    const key = keys[config.newReleasesProvider];
    const uri = provider.buildUri(key);

    console.log('Fetching new releases:', uri);

    return fetch(uri)
        .then(response => response.json())
        .then(json => convertListToSchema(json, provider))
        .catch(ex => console.log('parsing failed', ex));
};

module.exports.fetchDetails = (imdbId) => {
    const provider = providers[config.detailsProvider];
    const key = keys[config.detailsProvider];
    const uri = provider.buildUri(key, imdbId);

    console.log('Fetching movie details:', uri);

    return fetch(uri)
        .then(response => response.json())
        .then(json => convertDetailsToSchema(json, provider))
        .catch(ex => console.log('parsing failed', ex));
};
