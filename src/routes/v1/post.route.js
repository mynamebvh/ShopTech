const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const postController = require('@controllers/post.controller');

const router = express.Router();

router.route('/').get(postController.getPosts).post(postController.createPost);

router.route('/:postId').get(postController.getPost).patch(postController.updatePost).delete(postController.deletePost);

module.exports = router;
