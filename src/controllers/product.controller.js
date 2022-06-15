const httpStatus = require('http-status');

const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');

const { productService, formDataService, imageService, categoryService} = require('../services');

const createProduct = catchAsync(async (req, res) => {
  const body = await formDataService.parseForm(req);
  const arr = await imageService.uploadImgs(body.images);

  // console.log(body)
  const { name, shortDesc, desc, manufacturer, quantity, detail, category, price } = body.fields;

  const newBody = {
    name, shortDesc, desc, manufacturer, quantity, detail, category, price, images: arr.map(img => img.url)
  }
  const product = await productService.createProduct(newBody);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, 'Thành công', product));
});

const getProducts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const { length, start } = req.query;
  options.page = start / length + 1;
  options.limit = length;

  const data = await productService.getProducts(filter, options);
  data.draw = parseInt(req.query.draw);

  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Thành công', data));
});

const searchProduct = catchAsync(async (req, res) => {
  let result = await productService.searchProduct(req.query.text);
  res.status(httpStatus.OK).json(result)
})

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

const searchProductView = catchAsync(async (req, res) => {
  const data = await categoryService.getAllCategorys();
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  let products = await productService.searchProduct(req.query.text, filter, options);

  res.render('client/listProduct', { data, products});
})

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
  searchProductView
};
