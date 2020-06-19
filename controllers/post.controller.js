const mongoose = require("mongoose")
const cloudinary = require("cloudinary").v2
require("./../models/user.model")
require("./../models/post.model")
const User = mongoose.model('User')
const Post = mongoose.model('Post')

exports.createPost = async (req) => {
    // cloudinary configuration
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUD_API_SECRET
    })
    const data = {
        image: req.body.image,
    }

    try {
        const cloudUpload = await cloudinary.uploader.upload(data.image)
        const author = await User.findOne({ _id: req.user.id })
        const post = new Post({
            caption: req.body.caption,
            image: cloudUpload.secure_url,
            authorID: req.user.id,
            author: author.name
        })
        await post.save();
        await author.posts.push(post._id);
        await author.save()
        return post
    }
    catch (err) {
        console.log(err);
        return { "err": "Some error occured" }
    }


}

exports.getAllPosts = async () => {
    let posts = await Post.find()
    return posts
}

exports.getAllPostsByUser = async (id) => {
    let user = await User.findOne({"_id": id})
    if(!user) return {"err": "No user found"}

    let posts = []
    for(let i=0; i<user.posts.length; i++) {
        let post = await Post.findById(user.posts[i])
        posts.push(post)
    }
    return posts
}