const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const commentController = require('@controllers/comment.controller');

const router = express.Router();

router.route('/').get(commentController.getCommentsByProductId).post(commentController.createComment);

router.route('/:commentId').patch(commentController.updateComment).delete(commentController.deleteComment);

module.exports = router;
