const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { categoryService } = require('../services');

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

const manageCategory = catchAsync(async (req, res) => {
  res.render('admin/manage_category');
});

const manageUser = catchAsync(async (req, res) => {
  res.render('admin/manage_user');
});

const checkout = catchAsync(async (req, res) => {
  res.render('client/checkout');
});

const blog = catchAsync(async (req, res) => {
  res.render('client/blog');
});

const blogDetail = catchAsync(async (req, res) => {
  res.render('client/blog_detail');
});

const login = catchAsync(async (req, res) => {
  res.render('client/login');
});

module.exports = { homePage, loginPage, manageProduct, manageCategory, manageUser };
