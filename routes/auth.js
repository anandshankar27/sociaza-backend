const route = require("express").Router()
const jwt = require("jsonwebtoken")
const UserController = require("./../controllers/user.controller")
const { registrationValidator, loginValidator } = require("./../utils/validator")

route.post('/signup', async (req, res) => {
    let validation = await registrationValidator(req.body)

    if (validation.error != null) {
        res.send(validation.error.details[0].message)
    }
    else {
        let savedUser = await UserController.createUser(req.body)
        if (savedUser.err) {
            res.send(savedUser.err)
        }
        else {
            res.send(savedUser)
        }
    }
})

route.post('/signin', async (req, res) => {
    let validation = await loginValidator(req.body)

    if (validation.error != null) {
        res.send(validation.error.details[0].message)
    }
    else {
        let validUser = await UserController.authenticateUser(req.body)
        if (validUser.err == null) {
            const authToken = jwt.sign({id: validUser._id}, process.env.TOKEN_SECRET)
            res.header('auth-token', authToken).json({"user": validUser, "token": authToken})
        }
        else {
            res.send(validUser.err)
        } 
    }

})

route.get('/verify/:token', async (req, res) => {
    let token = req.params.token
    let verfied = await UserController.verifyUser(token)
    res.send(verfied)
})

module.exports = route;