const httpStatus = require('http-status');
const { OrderProduct, OrderDetail } = require('../models/index');

const ApiError = require('../utils/ApiError');

/**
 * Query for order detail
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getOrderDetails = async (filter, options) => {
  const orders = await OrderDetail.paginate(filter, options);
  return orders;
};

/**
 * Create a order detail
 * @param {Object} postBody
 * @returns {Promise<OrderDetail>}
 */
const createOrderDetail = async (postBody) => {
  // if (await Post.isTitleDuplicate(postBody.title)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Tên bài viết đã tồn tại');
  // }

  const { products, order } = postBody;

  let arrQueryCreate = products.map((prod) => OrderProduct.create(prod));
  let orderProducts = await Promise.all(arrQueryCreate);

  return OrderDetail.create({ order, products: orderProducts });
};

/**
 * Get order detail by id
 * @param {ObjectId} id
 * @returns {Promise<OrderDetail>}
 */
const getOrderDetailById = async (id) => {
  return OrderDetail.findById(id);
};

/**
 * Update order detail by id
 * @param {ObjectId} orderDetailId
 * @param {Object} updateBody
 * @returns {Promise<OrderDetail>}
 */
const updateOrderDetailById = async (postId, updateBody) => {
  const order = await getOrderDetailById(postId);

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Đơn hàng không tồn tại');
  }
  // if (updateBody.title && (await Post.isTitleDuplicate(updateBody.title))) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Tên bài viết đã tồn tại');
  // }

  Object.assign(post, updateBody);
  await post.save();
  return post;
};

/**
 * Delete order detail by id
 * @param {ObjectId} orderDetailId
 * @returns {Promise<OrderDetail>}
 */
const deleteOrderDetailById = async (orderDetailId) => {
  const order = await getOrderDetailById(orderDetailId);

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Đơn hàng không tồn tại');
  }
  await order.remove();
  return order;
};

module.exports = { getOrderDetails, createOrderDetail };
