const httpStatus = require('http-status');

const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');

const { postService, redisService } = require('../services');

const createPost = catchAsync(async (req, res) => {
  const post = await postService.createPost({ ...req.body, user: req.userId });

  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, 'Thành công', post));
});

const getPost = catchAsync(async (req, res) => {
  const { postId } = req.params;
  // let postCache = await redisService.getValueByField('posts', postId);

  // if (postCache) {
  //   res.status(httpStatus.OK).json(response(httpStatus.OK, 'Thành công', JSON.parse(postCache)));
  //   return;
  // }

  const post = await postService.getPostById(postId);
  // await redisService.saveTypeHashes('posts', post._id.toString(), post);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Thành công', post));
});

const getPosts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const postCache = await redisService.getValueByKey('posts');

  if (postCache) {
    res.status(httpStatus.OK).json(response(httpStatus.OK, 'Thành công', postCache));
    return;
  }

  const data = await postService.getPosts(filter, options);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Thành công', data));
});

const updatePost = catchAsync(async (req, res) => {
  const post = await postService.updatePostById(req.params.postId, req.body);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Cập nhật thành công', post));
});

const deletePost = catchAsync(async (req, res) => {
  await postService.deletePostById(req.params.postId);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Xoá thành công'));
});

module.exports = {
  getPost,
  createPost,
  getPosts,
  updatePost,
  deletePost,
};
