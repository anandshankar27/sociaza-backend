const router = require('express').Router()
const PostController = require('../controllers/post.controller')
const isAuthenticated = require('../authentication/jwtVerification')

router.get('/', isAuthenticated, async (req, res) => {
    return await PostController.getAllPosts(req, res)
})

router.get('/:username', isAuthenticated, async (req, res) => {
    return await PostController.getAllPostsByUser(req, res)
})

router.post('/', isAuthenticated, async (req, res) => {
    return await PostController.createPost(req, res)
})

router.delete('/:postID', isAuthenticated, async (req, res) => {
    return await PostController.deletePost(req, res)
})

module.exports = router