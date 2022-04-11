const httpStatus = require('http-status');
const formidable = require('formidable');

const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');

const { postService, redisService, formDataService, imageService } = require('../services');

const createPost = catchAsync(async (req, res) => {
  const body = await formDataService.parseForm(req);
  const { url } = await imageService.uploadImg(body.thumbnail.filepath);
  const { title, content, tag } = body.fields;

  // // console.log(body)
  const post = await postService.createPost({ title, content, tag, thumbnail: url, user: req.userId });

  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, 'Thành công'));
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

  // const postCache = await redisService.getValueByKey('posts');

  // if (postCache) {
  //   res.status(httpStatus.OK).json(response(httpStatus.OK, 'Thành công', postCache));
  //   return;
  // }

  const data = await postService.getPosts(filter, options);
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

  const post = await postService.updatePostById(req.params.postId, updateBody);

  res.locals = {
    category: 'post',
    id: req.params.postId,
  };

  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Cập nhật thành công', post));
  next();
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
