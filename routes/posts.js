const route = require("express").Router()
const isAuthenticated = require("./../controllers/jwtVerification")
const PostController = require("./../controllers/post.controller")
const { postValidator } = require("./../utils/validator")

route.get('/', isAuthenticated, async (req, res) => {
    let posts = await PostController.getAllPosts()
    res.send(posts)
})

route.post('/', isAuthenticated, async (req, res) => {
    let validation = await postValidator(req.body)

    if (validation.error != null) {
        res.send(validation.error.details[0].message)
    }
    else {
        let createdPost = await PostController.createPost(req)
        if (createdPost.err) {
            res.send(createdPost.err)
        }
        else {
            res.send(createdPost)
        }
    }
})

module.exports = route;