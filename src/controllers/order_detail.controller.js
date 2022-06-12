const httpStatus = require('http-status');

const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const response = require('../utils/response');

const { orderDetailService, redisService } = require('../services');

const createOrderDetail = catchAsync(async (req, res) => {
  const postBody = pick(req.body, ['products', 'order']);
  const orderDetail = await orderDetailService.createOrderDetail(postBody);

  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, 'Thành công', orderDetail));
});

const getOrdersDetailByOrderId = catchAsync(async (req, res) => {
  const orders = await orderDetailService.getOrdersDetailByOrderId(req.params.id);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Thành công', orders));
});

// const getPost = catchAsync(async (req, res) => {
//   const { postId } = req.params;
//   let postCache = await redisService.getValueByField('posts', postId);

//   if (postCache) {
//     res.status(httpStatus.OK).json(response(httpStatus.OK, 'Thành công', JSON.parse(postCache)));
//     return;
//   }

//   const post = await postService.getPostById(postId);
//   await redisService.saveTypeHashes('posts', post._id.toString(), post);
//   res.status(httpStatus.OK).json(response(httpStatus.OK, 'Thành công', post));
// });

const getOrderDetails = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  // const postCache = await redisService.getValueByKey('posts');

  // if (postCache) {
  //   res.status(httpStatus.OK).json(response(httpStatus.OK, 'Thành công', postCache));
  //   return;
  // }

  const data = await orderDetailService.getOrderDetails(filter, options);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Thành công', data));
});

// const updateOrderDetail = catchAsync(async (req, res) => {
//   const orderDetail = await postService.updatePostById(req.params.orderDetailId, req.body);
//   res.status(httpStatus.OK).json(response(httpStatus.OK, 'Cập nhật thành công', orderDetail));
// });

// const deleteOrderDetail = catchAsync(async (req, res) => {
//   await orderDetailService.deleteOrderDetailById(req.params.orderDetailId);
//   res.status(httpStatus.OK).json(response(httpStatus.OK, 'Xoá thành công'));
// });

module.exports = {
  getOrderDetails,
  createOrderDetail,
  getOrdersDetailByOrderId,
};
