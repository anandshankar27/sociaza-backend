const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    caption: { type: String },
    media: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post