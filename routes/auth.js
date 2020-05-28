const route = require("express").Router()
const UserModel = require("./../models/user.model")
const { registrationValidator, loginValidator }= require("./../utils/validator")

route.post('/signup', async (req, res) => {
    let validation = await registrationValidator(req.body)

    if (validation.error != null) {
        res.send(validation.error.details[0].message)
    }
    else {
        let savedUser = await UserModel.createUser(req.body)
        if (savedUser.err) {
            res.send(savedUser.err)
        }
        else {
            res.send(savedUser._id)
        }
    }

})

route.post('/signin', async (req, res) => {
    let validation = await loginValidator(req.body)

    if (validation.error != null) {
        res.send(validation.error.details[0].message)
    }
    else {
        let authToken = await UserModel.checkUser(req.body)
        if (savedUser.err) {
            res.send(savedUser.err)
        }
        else {
            res.send(savedUser._id)
        }
    }

})


module.exports = route;