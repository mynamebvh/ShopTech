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
  const { fullname, customerAddress, phone, city, district, ward, methodPay } = orderBody;

  console.log(orderBody)
  const order = { fullname, phone, methodPay};

  console.log(order)
  order.address = `${customerAddress}, ${ward}, ${district}, ${city}`;
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
 * Update order status by id
 * @param {ObjectId} orderId
 * @param {String} status
 * @returns {Promise<Order>}
 */
const updateStatusOrderById = async (orderId, status) => {
  const order = await getOrderById(orderId);

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Thông tin không tồn tại');
  }

  Object.assign(order, { status });
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

module.exports = { getOrders, createOrder, getOrderById, updateStatusOrderById, deleteOrderById };
