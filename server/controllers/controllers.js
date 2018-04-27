const express = require('express');
const router = express.Router();

const PostController = require('./post.controller');

const postController = new PostController(router);

module.exports = router;