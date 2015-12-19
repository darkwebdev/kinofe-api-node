const _ = require('lodash');

const applyConverter = (converters, movie) =>
    _.mapValues(converters, (converter) => converter(movie));

module.exports.convertListToSchema = (responseJson, provider) => {
    const movies = _.get(responseJson, provider.moviesProp, []);

    return movies.map(movie =>
        applyConverter(provider.converters, movie));
};

module.exports.convertDetailsToSchema = (responseJson, provider) => {
    const movie = _.get(responseJson, provider.movieProp, {});

    return applyConverter(provider.converters, movie);
};
