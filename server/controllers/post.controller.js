const express = require('express');
const Post = require('../models/post.model');

class PostController {
    constructor(router) {
        router.route('/posts')
            .get(this.getPosts)
            .post(this.createPost);
    }

    async getPosts(req, res, next) {
       try {
           const posts = await Post.find()
            res.status(200).json(posts)
       } catch (err) {
           next(err);
       }
    }

    async createPost(req, res, next) {
        try {
            const checkTitle = await Post.findOne({'title' : req.body.title})
            if(checkTitle) {
                res.status(403).json({'Error' : `A Post with the title ${req.body.title} already exists`})
            } else {
                const post = await Post.create(new Post(req.body))
                res.status(200).json(post)
            }
        } catch(err) {
            next(err);
        }
    }
}

module.exports = PostController;