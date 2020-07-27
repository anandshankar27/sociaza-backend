const router = require('express').Router()
const UserController = require("../controllers/user.controller")
const isAuthenticated = require("../authentication/jwtVerification")

router.post('/signup', async (req, res) => {
    return await UserController.createUser(req, res)
})

router.post('/signin', async (req, res) => {
    return await UserController.authenticateUser(req, res)
})

router.get('/', async (req, res) => {
    return await UserController.getUsers(req, res)
})

router.get('/@:username', isAuthenticated, async (req, res) => {
    return await UserController.getUserProfile(req, res)
})

router.put('/@:username', isAuthenticated, async (req, res) => {
    return await UserController.updateUser(req, res)
})

router.put('/updatePassword/@:username', isAuthenticated, async (req, res) => {
    // return await UserController.updatePassword(req, res)
})

router.delete('/delete/@:username', isAuthenticated, async(req, res) => {
    return await UserController.deleteUser(req, res)
})
module.exports = router