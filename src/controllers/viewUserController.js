const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { categoryService } = require('../services');

const homePage = catchAsync(async (req, res) => {
  const data = await categoryService.getCategorys();
  console.log('data', data);
  res.render('client/home', { data });
});

const listProduct = catchAsync(async (req, res) => {
  res.render('client/listProduct');
});

const productDetail = catchAsync(async (req, res) => {
  res.render('client/product');
});

const cart = catchAsync(async (req, res) => {
  res.render('client/cart');
});

const checkout = catchAsync(async (req, res) => {
  res.render('client/checkout');
});

const blog = catchAsync(async (req, res) => {
  const data = await categoryService.getCategorys();

  res.render('client/blog', { data });
});

const blogDetail = catchAsync(async (req, res) => {
  res.render('client/blog_detail');
});

const login = catchAsync(async (req, res) => {
  const data = await categoryService.getCategorys();

  res.render('client/login', { data });
});

const profile = catchAsync(async (req, res) => {
  const data = await categoryService.getCategorys();

  res.render('client/profile', { data });
});
module.exports = { homePage, listProduct, productDetail, cart, checkout, blog, blogDetail, login, profile };
