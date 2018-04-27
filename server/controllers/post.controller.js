const express = require('express');
const Post = require('../models/post.model');

class PostController {
    constructor(router) {
        router.route('/posts')
            .get(this.getPosts)
            .post(this.createPost);
        router.route('/posts/:_id')
            .get(this.getPost)
            .put(this.updatePost)
            .delete(this.softDeletePost);
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

    async getPost(req, res, next) {
        try {
            const post = await Post.findOne({'_id' : req.params._id, 'is_deleted': false})
                res.status(200).json(post);
        } catch(err) {
            next(err);
        }
    }

    async updatePost(req, res, next) {
        try{
            console.log('hitting');
            const updatedPost = await Post.findOneAndUpdate({'_id' : req.params._id, 'is_deleted' : false}, req.body, {'new' : true})
                res.status(200).json(updatedPost);
        } catch(err) {
            next(err);
        }
    }

    async softDeletePost(req, res, next) {
        try {
            const softDeletedPost = await Post.findOneAndUpdate({'_id' : req.params._id, 'is_deleted' : false}, {'is_deleted' : true}, {'new' : true})
                res.json(softDeletedPost);
        } catch(err) {
            next(err);
        }
    }
     
}

module.exports = PostController;