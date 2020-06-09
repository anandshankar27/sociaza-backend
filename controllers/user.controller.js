const bcrypt = require("bcryptjs")
const uniqueString = require('unique-string')
const mongoose = require("mongoose")
require("./../models/user.model")
const User = mongoose.model('User')
const { sendVerificationEmailtoUser } = require("./../utils/nodemailer")

exports.createUser = async (data) => {
    const existingUser = await User.findOne({ "email": data.email })
    if (existingUser == null) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(data.password, salt)
        const user = new User({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            username: data.email.substring(0, data.email.indexOf('@')),
            verificationToken: uniqueString()
        })
        await user.save()
        sendVerificationEmailtoUser(user)
        return user
    }
    else {
        return { "err": "Email is already registered." }
    }
}

exports.authenticateUser = async (data) => {
    const user = await User.findOne({ "email": data.email })
    if (!user) return { "err": { "email": "Account doesn't exists." } }

    const passwordMatch = await bcrypt.compare(data.password, user.password)
    if (!passwordMatch) return { "err": { "password": "Incorrect Password" } }

    if (!user.isVerified) return { "err": { "verify": "Email not verified" } }
    return user
}

exports.verifyUser = async (data) => {
    const user = await User.findOne({ "verificationToken": data })
    if (!user) return { "err": "Account doesn't exists or already verified." }
    user.isVerified = true;
    user.verificationToken = "";
    await user.save()
    return { "success": `Hello ${user.name}, Your account  is verfied` }
}

exports.findUser = async (data) => {
    const user = await User.findOne({ "_id": data })
    if (!user) return { "err": "Some error occured" }
    return user
}