const httpStatus = require('http-status');
const { Comment } = require('../models/index');
const productService = require("./product.service")
const ApiError = require('../utils/ApiError');

/**
 * Query for comment
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getComments = async (filter, options) => {
  const comments = await Comment.paginate(filter, options);
  return comments;
};


const getCommentsByProductSlug = async (slug) => {

  const product = await productService.getProductBySlug(slug)

  // console.log(product)
  const comments = await Comment.find({product: product._id}).populate({path: "user", select: "firstName lastName avatar"});

  // console.log(comments)
  return comments;
};
/**
 * Create a comment
 * @param {Object} commentBody
 * @returns {Promise<Comment>}
 */
const createComment = async (commentBody) => {
  return Comment.create(commentBody);
};

/**
 * Get comment by id
 * @param {ObjectId} id
 * @returns {Promise<Comment>}
 */
const getCommentById = async (id) => {
  return Comment.findById(id);
};

/**
 * Update comment by id
 * @param {ObjectId} commentId
 * @param {Object} updateBody
 * @returns {Promise<Comment>}
 */
const updateCommentById = async (commentId, updateBody) => {
  const comment = await getCommentById(commentId);

  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bình luận khồng tồn tại');
  }

  Object.assign(comment, updateBody);
  await comment.save();
  return comment;
};

/**
 * Delete comment by id
 * @param {ObjectId} commentId
 * @returns {Promise<Comment>}
 */
const deleteCommentById = async (commentId) => {
  const comment = await getCommentById(commentId);

  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bình luận khồng tồn tại');
  }

  await comment.remove();
  return comment;
};

module.exports = {
  getComments,
  createComment,
  updateCommentById,
  deleteCommentById,
  getCommentsByProductSlug
};
