const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { categoryService, postService, productService, sliderService } = require('../services');

const homePage = catchAsync(async (req, res) => {
  res.render('admin/dashboard');
});

const loginPage = catchAsync(async (req, res) => {
  console.log('login');
  res.render('admin/login');
});

const manageProduct = catchAsync(async (req, res) => {
  res.render('admin/manage_product');
});

const manageVoucher = catchAsync(async (req, res) => {
  res.render('admin/manage_voucher');
});

const createProduct = catchAsync(async (req, res) => {
  const categorys = await categoryService.getAllCategorys();

  console.log(categorys);
  res.render('admin/manage_product/create', { categorys });
});

const manageCategory = catchAsync(async (req, res) => {
  res.render('admin/manage_category');
});

const manageUser = catchAsync(async (req, res) => {
  res.render('admin/manage_user');
});

const manageBlog = catchAsync(async (req, res) => {
  res.render('admin/manage_blog');
});

const createArticles = catchAsync(async (req, res) => {
  res.render('admin/manage_blog/create');
});

const editArticles = catchAsync(async (req, res) => {
  const data = await postService.getPostById(req.params.id);
  res.render('admin/manage_blog/edit', { data });
});

const editProduct = catchAsync(async (req, res) => {
  const categorys = await categoryService.getAllCategorys();

  const product = await productService.getProductById(req.params.id);
  // console.log(data)
  res.render('admin/manage_product/edit', { categorys, product });
});

const manageCheckout = catchAsync(async (req, res) => {
  res.render('admin/manage_checkout');
});

const manageSlider = catchAsync(async (req, res) => {
  res.render('admin/manage_slider');
});

const createSlider = catchAsync(async (req, res) => {
  res.render('admin/manage_slider/create');
});

const editSlider = catchAsync(async (req, res) => {
  const data = await sliderService.getSliderById(req.params.id)

  console.log(data)
  res.render('admin/manage_slider/edit', { data });
});

module.exports = {
  homePage,
  loginPage,
  manageProduct,
  manageCategory,
  manageUser,
  manageBlog,
  createArticles,
  editArticles,
  createProduct,
  editProduct,
  manageCheckout,
  manageSlider,
  createSlider,
  editSlider,
  manageVoucher
};
