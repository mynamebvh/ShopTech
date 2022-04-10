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

const manageBlog = catchAsync(async (req, res) => {
  res.render('admin/manage_blog');
});


const createArticles = catchAsync(async (req, res) => {
  res.render('admin/manage_blog/create');
});

module.exports = { homePage, loginPage, manageProduct, manageCategory, manageUser, manageBlog ,createArticles};
