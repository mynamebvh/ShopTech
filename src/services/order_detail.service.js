const httpStatus = require('http-status');
const mongoose = require('mongoose');
const voucherService = require("./voucher.service")
const orderService = require("./order.service")

const { OrderProduct, OrderDetail } = require('../models/index');

const ApiError = require('../utils/ApiError');
const calculatorVoucher =  require('../utils/calculatorVoucher');

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
 * get orderDetail by order id
 * @param {ObjectID} id
 * @returns {Promise<QueryResult>}
 */
const getOrdersDetailByOrderId = async (id) => {
  let result = await Promise.all([
    OrderDetail.findOne({ order: id })
      .populate({
        path: 'products',
        populate: { path: 'product' },
      })
      .lean(),
    orderService.getOrderById(id)
  ]);

  const [orderDetail, order] = result;

  orderDetail.total = orderDetail.products.reduce((a, b) => {
    return a + (b.product.price * b.quantity);
  }, 0);

  if(order.code){
    const { type, max, discount } = await voucherService.getVoucherByCodeAdmin(order.code)
    orderDetail.discount = calculatorVoucher(type, discount, max, orderDetail.total) ;
  }else {
    orderDetail.discount = 0;
  }

  orderDetail.total += orderDetail.total * 0.08;
  return orderDetail;
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

  let arrQueryCreate = products.map((prod) => OrderProduct.create({ product: prod.id, quantity: parseInt(prod.quantity) }));
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

module.exports = { getOrderDetails, createOrderDetail, getOrdersDetailByOrderId };
