const bcrypt = require("bcryptjs")
const mongoose = require("mongoose")
require("./../models/user.model")
const User = mongoose.model('User')

exports.createUser = async (data) => {
    const existingUser = await User.findOne({ "email": data.email })
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

exports.checkUser = async (data) => {
    const user = await User.findOne({"email": data.email})
    if (!user) return { "err": "Account doesn't exists." }

    const passwordMatch = await bcrypt.compare(data.password, user.password)
    if (!passwordMatch) return { "err": "Incorrect Password" }

    return user
}