const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { categoryService, postService, productService } = require('../services');

const homePage = catchAsync(async (req, res) => {
  const data = await categoryService.getCategorys();
  res.render('client/home', { data });
});

const listProduct = catchAsync(async (req, res) => {
  const data = await categoryService.getCategorys();
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const category = await categoryService.getCategoryBySlug(filter, options, req.params.category)
  // const products = await productService.getProductByCategory(category)
  res.render('client/listProduct',{ data, products: category.products.data});
});

const productDetail = catchAsync(async (req, res) => {
  const data = await categoryService.getCategorys();
  const slug = req.params.slug

  const product = await productService.getProductBySlug(slug)

  console.log(product)
  res.render('client/product', { data, product });
});

const cart = catchAsync(async (req, res) => {
  res.render('client/cart');
});

const checkout = catchAsync(async (req, res) => {
  res.render('client/checkout');
});

const blog = catchAsync(async (req, res) => {
  const data = await categoryService.getCategorys();

  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const articles = await postService.getPosts(filter, options);

  res.render('client/blog', { data, articles });
});

const blogDetail = catchAsync(async (req, res) => {
  const data = await categoryService.getCategorys();
  const article = await postService.getPostBySlug(req.params.slug);
  // console.log(post)
  res.render('client/blog_detail', { data, article });
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
