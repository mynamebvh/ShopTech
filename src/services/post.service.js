const httpStatus = require('http-status');
const { Post } = require('../models/index');
const redisService = require('./redis.service');
const ApiError = require('../utils/ApiError');

const KEY = 'post'

/**
 * Query for post
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getPosts = async (filter, options) => {
  const post = await Post.paginate(filter, options);
  return post;
};

/**
 * Create a post
 * @param {Object} postBody
 * @returns {Promise<Post>}
 */
const createPost = async (postBody) => {
  if (await Post.isTitleDuplicate(postBody.title)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Tên bài viết đã tồn tại');
  }

  return Post.create(postBody);
};

/**
 * Get post by id
 * @param {ObjectId} id
 * @returns {Promise<Post>}
 */
const getPostById = async (id) => {
  // await redisService.setex(`post`, id, '1m', await Post.findById(id));
  return Post.findById(id);
};

/**
 * Get post by slug
 * @param {String} slug
 * @returns {Promise<Post>}
 */
const getPostBySlug = async (slug) => {
  // let postCache = await redisService.hGet(KEY, { type: 'getPostBySlug', slug })

  // if(postCache) return postCache

  let post =  Post.findOne({ slug });
  // await redisService.hSet(KEY, { type: 'getPostBySlug', slug }, post)
  return post;
};

/**
 * Update post by id
 * @param {ObjectId} postId
 * @param {Object} updateBody
 * @returns {Promise<Post>}
 */
const updatePostById = async (postId, updateBody) => {
  const post = await getPostById(postId);
  
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bài viêt không tồn tại');
  }

  if (updateBody.title && (await Post.isTitleDuplicate(updateBody.title, post.id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Tên bài viết đã tồn tại');
  }

  Object.assign(post, updateBody);
  await post.save();
  return post;
};

/**
 * Delete post by id
 * @param {ObjectId} postId
 * @returns {Promise<Post>}
 */
const deletePostById = async (postId) => {
  const post = await getPostById(postId);

  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bài viết không tồn tại');
  }
  await post.remove();
  return post;
};

module.exports = {
  getPostById,
  getPosts,
  createPost,
  updatePostById,
  deletePostById,
  getPostBySlug
};
