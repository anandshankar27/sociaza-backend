const mongoose = require("mongoose")
const Schema = mongoose.Schema

const postSchema = new Schema({
    authorID: {
        type: Schema.Types.ObjectId,
        required: true
    },
    author: {
        type: String
    },
    caption: {
        type: String
    },
    image: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

const Post = mongoose.model('Post', postSchema)
module.exports.Post = Post