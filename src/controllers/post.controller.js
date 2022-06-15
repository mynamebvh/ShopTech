const httpStatus = require('http-status');
const formidable = require('formidable');

const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');

const KEY = 'post'

const { postService, redisService, formDataService, imageService } = require('../services');

const createPost = catchAsync(async (req, res) => {
  const body = await formDataService.parseForm(req);
  const { url } = await imageService.uploadImg(body.thumbnail.filepath);
  const { title, content, tag } = body.fields;

  const post = await Promise.all([ postService.createPost({ title, content, tag, thumbnail: url, user: req.userId }), redisService.del(KEY)]);

  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, 'Thành công'));
});

const getPost = catchAsync(async (req, res) => {
  const { postId } = req.params;

  // if (postCache) {
  //   return res.status(httpStatus.OK).json(response(httpStatus.OK, 'Thành công', postCache));
  // }

  // const post = await postService.getPostById(postId);
  // await redisService.hSet(KEY, {type: 'getPost', postId }, post);

  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Thành công', post));
});

const getPosts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  let postCache = await redisService.hGet(KEY, { type: 'getPosts', ...filter, ...options });

  if(postCache){
    console.log("cache")
    return res.status(httpStatus.OK).json(response(httpStatus.OK, 'Thành công', postCache));
  }

  const data = await postService.getPosts(filter, options);
  await redisService.hSet(KEY, { type: 'getPosts', ...filter, ...options }, data);
 
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Thành công', data));
});

const updatePost = catchAsync(async (req, res, next) => {
  const body = await formDataService.parseForm(req);
  const { url } = await imageService.uploadImg(body.thumbnail?.filepath);
  const { title, content, tag } = body.fields;

  const updateBody = {
    title,
    content,
    tag,
    thumbnail: url,
    user: req.userId,
  };

  if(!url){
    delete updateBody.thumbnail;
  }

  const post = await Promise.all([postService.updatePostById(req.params.postId, updateBody), redisService.del(KEY)]);

  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Cập nhật thành công', post));
  next();
});

const deletePost = catchAsync(async (req, res) => {
  await Promise.all([ postService.deletePostById(req.params.postId), redisService.del(KEY)]);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Xoá thành công'));
});

module.exports = {
  getPost,
  createPost,
  getPosts,
  updatePost,
  deletePost,
};
