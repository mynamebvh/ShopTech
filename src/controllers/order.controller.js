const httpStatus = require('http-status');

const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');

const { orderService, orderDetailService, voucherService } = require('../services');

const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.createOrder(req.body);

  
  const postBody = pick(req.body, ['products']);
  postBody.order = order.id;

  await orderDetailService.createOrderDetail(postBody);

  if(req.body.methodPay === "COD"){
    await voucherService.updateVoucherQuantityByCode(req.body.code);
  }

  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, 'Thành công', null));
});

const getOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const order = await orderService.getOrderById(orderId);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Thành công', order));
});

const getOrders = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const { length, start } = req.query;
  options.page = start / length + 1;
  options.limit = length;
  
  const data = await orderService.getOrders(filter, options);

  data.draw = parseInt(req.query.draw);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Thành công', data));
});

const updateOrder = catchAsync(async (req, res) => {
  const order = await orderService.updateStatusOrderById(req.params.orderId, req.body.status);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Cập nhật thành công', order));
});

const deleteOrder = catchAsync(async (req, res) => {
  await orderService.deleteOrderById(req.params.orderId);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Xoá thành công'));
});

module.exports = {
  createOrder,
  getOrder,
  getOrders,
  updateOrder,
  deleteOrder,
};
