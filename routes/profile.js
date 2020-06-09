const route = require("express").Router()
const UserController = require("./../controllers/user.controller")
const isAuthenticated = require("./../controllers/jwtVerification")

route.get('/', isAuthenticated,  async (req, res) => {
    const loggedInUser = await UserController.findUser(req.user.id)
    console.log(loggedInUser)
    res.send(loggedInUser)
})




module.exports = route;