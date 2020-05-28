const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcrypt = require("bcryptjs")

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
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
    date: {
        type: Date,
        default: Date.now()
    }
})

const User = mongoose.model('User', userSchema)

exports.createUser = async (data) => {
    let existingUser = await User.findOne({ "email": data.email })
    if (existingUser == null) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(data.password, salt)
        const user = new User({
            name: data.name,
            email: data.email,
            password: hashedPassword
        })
        return await user.save()
    }
    else {
        return { "err": "Email is already registered." }
    }
} 