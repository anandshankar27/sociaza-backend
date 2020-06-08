const mongoose = require("mongoose")
require("./../models/user.model")
require("./../models/post.model")
const User = mongoose.model('User')
const Post = mongoose.model('Post')


exports.createPost = async (req) => {
    const author = await User.findOne({ _id: req.user.id })
    try {
        const post = new Post({
            caption: req.body.caption,
            image: req.body.image,
            authorID: req.user.id,
            author: author.name
        })
        return await post.save();
    }
    catch (err) {
        console.log(err);
        return { "err": "Some error occured" }
    }


}

exports.getAllPosts = async () => {
    let posts = await Post.find().sort({ date: 'desc' })
    return posts 
}

exports.getPostsByUser = async (user) => {

}