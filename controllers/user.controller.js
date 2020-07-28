const bcrypt = require('bcryptjs')
const uniqueString = require('unique-string')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
require("../models/User.Model")
const User = mongoose.model('User')
const { registrationValidator, loginValidator } = require('../utils/validator')
const errorMessages = require('./../utils/errorMessages')

exports.createUser = async (req, res) => {

    let data = req.body
    let errors = {}
    let validation = await registrationValidator(data)
    if (validation.error != null) {
        validation.error.details.forEach(field => {
            errors[field.path] = errorMessages[field.path]
        })
        res.status(400).json(errors)
    }
    else {
        const existingEmail = await User.findOne({ "email": data.email })
        const existingUsername = await User.findOne({ "username": data.username })
        if (existingEmail != null) {
            errors.email = "Email is already registered."
        }
        if (existingUsername != null) {
            errors.username = "Username already exists."
        }

        if (Object.keys(errors).length != 0) {
            res.status(400).json(errors)
        }
        else {
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(data.password, salt)
            const user = new User({
                name: data.name,
                email: data.email,
                password: hash,
                username: data.username,
                verificationToken: uniqueString()
            })
            await user.save()
            // sendVerificationEmailtoUser(user)
            res.json('Account Created')
        }
    }
}

exports.authenticateUser = async (req, res) => {
    let data = req.body
    let errors = {}
    let validation = await loginValidator(data)

    if (validation.error != null) {
        validation.error.details.forEach(field => {
            errors[field.path] = errorMessages[field.path]
        })
        res.status(400).json(errors)
    }
    else {
        let filter = { 'email': data.email }
        let user = await User.findOne(filter)

        if (user === null) {
            errors.email = `Account doesn't exists`
            return res.status(400).json(errors)
        }

        if (!user.isVerified) {
            errors.email = `Please verify your account before log in`
            return res.status(400).json(errors)
        }
        let passwordMatch = await bcrypt.compare(data.password, user.password)
        if (!passwordMatch) {
            errors.password = `Incorrect Password`
            return res.status(400).json(errors)
        }

        const payload = {
            name: user.name,
            username: user.username,
            bio: user.bio,
            dp: user.dp,
            email: user.email
        }

        const token = jwt.sign(payload, process.env.TOKEN_SECRET)
        res.header('auth-token', token).json({ 'token': token })
    }
}

exports.getUsers = (req, res) => {
    User.find()
        .sort({ 'createdAt': -1 })
        .then((users) => res.json(users))
        .catch((err) => res.status(400).json(err))
}

exports.getUserProfile = async (req, res) => {
    let selectedFields = { 'name': 1, 'username': 1, 'dp': 1, 'bio': 1, 'posts': 1, 'following': 1, 'followers': 1, '_id': 0 }
    let user = await User.findOne({ 'username': req.params.username })
        .select(selectedFields)

    return user === null ? res.status(400).json({ 'error': 'No User Found' }) : res.json(user)
}

exports.updateUser = async (req, res) => {
    let filter = { 'username': req.params.username }

    if (req.user.username !== filter.username) {
        return res.status(400).json({ 'error': 'Access Denied' })
    }

    let user = await User.findOne(filter)

    if (user === null) return res.status(400).json({ 'error': 'No user found' })

    user.name = req.body.name || user.name
    user.bio = req.body.bio || user.bio
    user.dp = req.body.dp || user.dp

    let updatedUser = await user.save()
    return res.json('User Updated')
}

exports.updatePassword = async (req, res) => {
    let filter = { 'username': req.params.username }

    if (req.user.username !== filter.username) {
        return res.status(400).json({ 'error': 'Access Denied' })
    }
}

exports.deleteUser = async (req, res) => {
    let filter = { 'username': req.params.username }

    if (req.user.username !== filter.username) {
        return res.status(400).json({ 'error': 'Access Denied' })
    }
    User.findOneAndDelete(filter)
        .then(user => res.json('Account Deleted'))
        .catch(err => res.status(400).json('Error ->' + err))
}