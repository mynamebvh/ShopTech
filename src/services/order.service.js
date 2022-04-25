const httpStatus = require('http-status');
const { Order } = require('../models/index');

const ApiError = require('../utils/ApiError');

/**
 * Query for order
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getOrders = async (filter, options) => {
  const order = await Order.paginate(filter, options);
  return order;
};

/**
 * Create a order
 * @param {Object} orderBody
 * @returns {Promise<Order>}
 */
const createOrder = async (orderBody) => {
  const { firstName, lastName, customerAddress, phone, city, district, ward } = orderBody;

  const order = { firstName, lastName, phone, customerAddress };
  order.address = `${ward}, ${district}, ${city}`;
  return Order.create(order);
};

/**
 * Get order by id
 * @param {ObjectId} id
 * @returns {Promise<Post>}
 */
const getOrderById = async (id) => {
  return Order.findById(id);
};

/**
 * Update order by id
 * @param {ObjectId} orderId
 * @param {Object} updateBody
 * @returns {Promise<Order>}
 */
const updateOrderById = async (orderId, updateBody) => {
  const order = await getOrderById(orderId);

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Thông tin không tồn tại');
  }

  Object.assign(order, updateBody);
  await order.save();
  return order;
};

/**
 * Delete order by id
 * @param {ObjectId} orderId
 * @returns {Promise<order>}
 */
const deleteOrderById = async (orderId) => {
  const order = await getOrderById(orderId);

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bài viết không tồn tại');
  }
  await order.remove();
  return order;
};

module.exports = { getOrders, createOrder, getOrderById, updateOrderById, deleteOrderById };
