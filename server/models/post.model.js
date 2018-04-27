const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title : String,
    body : String,
    is_deleted : {
        type : Boolean,
        default : false
    }
});

const Post = module.exports = mongoose.model('Post', PostSchema);