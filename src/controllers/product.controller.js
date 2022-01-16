const httpStatus = require('http-status');

const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');

const { productService } = require('../services');

const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, 'Thành công', product));
});

const getProducts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const data = await productService.getProducts(filter, options);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Thành công', data));
});

const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Thành công', product));
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProductById(req.params.productId, req.body);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Cập nhật thành công', product));
});

const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProductById(req.params.productId);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Xoá thành công'));
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
