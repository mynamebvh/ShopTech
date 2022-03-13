const httpStatus = require('http-status');

const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');

const { commentService } = require('../services');

const createComment = catchAsync(async (req, res) => {
  const comment = await commentService.createComment({ ...req.body, user: req.userId });

  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, 'Thành công', comment));
});

// const getPost = catchAsync(async (req, res) => {
//   const { postId } = req.params;
//   let postCache = await redisService.getValueByField('posts', postId);

//   if (postCache) {
//     res.status(httpStatus.OK).json(response(httpStatus.OK, 'Thành công', JSON.parse(postCache)));
//     return;
//   }

//   const post = await postService.getPostById(postId);
//   await redisService.saveTypeHashes('posts', post._id.toString(), post);
//   res.status(httpStatus.OK).json(response(httpStatus.OK, 'Thành công', post));
// });

const getCommentsByProductId = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['product', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);

  const data = await commentService.getComments(filter, options);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Thành công', data));
});

const updateComment = catchAsync(async (req, res) => {
  const comment = await commentService.updateCommentById(req.params.commentId, req.body);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Cập nhật thành công', comment));
});

const deleteComment = catchAsync(async (req, res) => {
  await commentService.deleteCommentById(req.params.commentId);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Xoá thành công'));
});

module.exports = {
  createComment,
  getCommentsByProductId,
  updateComment,
  deleteComment,
};
