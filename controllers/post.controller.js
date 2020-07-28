const mongoose = require('mongoose')
const cloudinary = require("cloudinary").v2
require("../models/Post.Model")
require("../models/User.Model")
const Post = mongoose.model('Post')
const User = mongoose.model('User')
const { postValidator } = require('../utils/validator')
const errorMessages = require('../utils/errorMessages')
const isImageUrl = require('is-image-url');

exports.createPost = async (req, res) => {
    let validation = await postValidator(req.body)
    let errors = {}
    if (validation.error != null) {
        validation.error.details.forEach(field => {
            errors[field.path] = errorMessages[field.path]
        })
        res.status(400).json(errors)
    }
    else {
        if (!isImageUrl(req.body.media)) return res.status(400).json(`Uploaded media must be an image`)

        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_API_SECRET
        })

        try {
            const author = await User.findOne({ 'username': req.user.username })
            if (!author) return res.status(400).json('Access Denied')
            const cloudUpload = await cloudinary.uploader.upload(req.body.media)
            const post = new Post({
                caption: req.body.caption,
                media: cloudUpload.secure_url,
                author
            })
            await post.save();
            author.posts = author.posts + 1;
            await author.save();
            res.json('Post Added')
        }
        catch (err) {
            res.status(400).json(err)
        }
    }
}

exports.getAllPosts = (req, res) => {
    Post.find()
        .populate('author', { 'name': 1, 'username': 1, 'dp': 1, '_id': 0 })
        .sort({ 'updatedAt': -1 })
        .then(posts => res.json(posts))
        .catch(err => res.status(400).json(err))
}

exports.getAllPostsByUser = async (req, res) => {
    let author = await User.findOne({ 'username': req.params.username })
    if (!author) return res.status(400).json('No user Found')

    Post.find({ 'author': author })
        .populate('author', { 'name': 1, 'username': 1, 'dp': 1, '_id': 0 })
        .sort({ 'createdAt': -1 })
        .then(posts => res.json(posts))
        .catch(err => res.status(400).json('Some Error Occured'))
}

exports.deletePost = async (req, res) => {
    const post = await Post.findById(req.params.postID)
    if (post === null) return res.status(400).json('No Posts Found')

    const author = await User.findById(post.author)
    if (author === null || req.user.username !== author.username) return res.status(400).json('Access Denied')

    Post.findByIdAndDelete(req.params.postID)
        .then(() => {
            author.posts = author.posts - 1
            author.save()
                .then(() => res.json('Post Deleted'))
        })
        .catch(err => res.status(400).json('Error ->' + err))
}

exports.deleteAllPostsByUser = async (req, res) => {
    let filter = { 'author.username': req.params.username }

    if (req.user.username !== filter["author.username"]) return res.status(400).json('Access Denied')

    Post.deleteMany(filter)
        .then(() => console.log('All Posts Deleted'))
        .catch(err => res.status(400))

}