const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments'
    }],
    likers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    date: {
        type: Date,
        default: Date.now
    },
    text: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('post', postSchema);