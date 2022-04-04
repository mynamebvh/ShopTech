const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const homePage = catchAsync(async (req, res) => {
  res.render('client/home');
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
  res.render('client/blog');
});

module.exports = { homePage, listProduct, productDetail, cart, checkout, blog };
