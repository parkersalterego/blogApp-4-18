const express = require('express');
const router = express.Router();

const UserController = require('./user.controller');
const PostController = require('./post.controller');

const postController = new PostController(router);
const userController = new UserController(router);

module.exports = router;