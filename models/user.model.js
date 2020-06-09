const mongoose = require("mongoose")
const Schema = mongoose.Schema


const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 30
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    },
    displayPicture: {
        type: String
    },
    posts: {
        type: Array
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

const User = mongoose.model('User', userSchema)
module.exports.User = User

