const mongoose = require('mongoose');

const schema = mongoose.Schema({
    imdbId: { type: String, unique: true },
    title: String,
    rating: Number,
    votes: Number,
    year: Number,
    desc: String,
    poster: {
        small: String,
        normal: String,
        large: String,
    },
    runtime: Number,
    genres: [String],
    directors: [{
        name: String,
        imdbId: String,
    }],
    actors: [{
        name: String,
        imdbId: String,
        character: String,
        photo: String,
    }],
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Movie', schema);