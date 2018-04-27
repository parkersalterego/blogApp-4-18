const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title : String,
    body : String
});

const Post = module.exports = mongoose.model('Post', PostSchema);