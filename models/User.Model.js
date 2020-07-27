const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3 },
    username: { type: String, required: true, unique: true, minlength: 3 },
    email: { type: String, required: true, unique: true, minlength: 5 },
    bio: { type: String },
    dp: { type: String, default: `https://res.cloudinary.com/anandshankar/image/upload/v1595807127/sociaza/929493_t2p0f1.svg` },
    password: { type: String, required: true, minlength: 8 },
    isVerified: { type: Boolean, default: true },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    verificationToken: {type: String, required: true}
}, {
    timestamps: true
})


const User = mongoose.model('User', userSchema)

module.exports = User