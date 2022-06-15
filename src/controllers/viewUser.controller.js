const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {
  categoryService,
  postService,
  productService,
  sliderService,
  paymentService,
  userService,
  commentService,
  authService
} = require('../services');

const homePage = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await Promise.all([
    categoryService.getAllCategorys(),
    sliderService.getSliders(filter, options),
    productService.queryClassification(),
    productService.queryRandom(),
  ]);

  res.render('client/home', { data: result[0], sliders: result[1].data, tab: result[2], random: result[3] });
});

const listProduct = catchAsync(async (req, res) => {
  const data = await categoryService.getAllCategorys();
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  // console.log('cate', req.params);
  const category = await categoryService.getCategoryBySlug(filter, options, req.params.category);
  // const products = await productService.getProductByCategory(category)
  res.render('client/listProduct', { data, products: category.products.data });
});

const productDetail = catchAsync(async (req, res) => {
  const slug = req.params.slug;
  const result = await Promise.all([
    categoryService.getAllCategorys(),
    productService.getProductBySlug(slug),
    productService.getRelatedProducts(slug),
    commentService.getCommentsByProductSlug(slug),
    userService.getUserById(req.userId),
  ]);

  res.render('client/product', {
    data: result[0],
    product: result[1],
    relateds: result[2],
    auth: req.auth,
    comments: result[3],
    user: result[4],
  });
});

const cart = catchAsync(async (req, res) => {
  res.render('client/cart');
});

const checkout = catchAsync(async (req, res) => {
  const data = await categoryService.getAllCategorys();

  res.render('client/checkout', { data });
});

const blog = catchAsync(async (req, res) => {
  const data = await categoryService.getAllCategorys();

  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const articles = await postService.getPosts(filter, options);

  res.render('client/blog', { data, articles });
});

const blogDetail = catchAsync(async (req, res) => {
  const data = await categoryService.getAllCategorys();
  const article = await postService.getPostBySlug(req.params.slug);
  res.render('client/blog_detail', { data, article });
});

const login = catchAsync(async (req, res) => {
  const data = await categoryService.getAllCategorys();

  res.render('client/login', { data });
});

const signup = catchAsync(async (req, res) => {
  const data = await categoryService.getAllCategorys();

  res.render('client/signup', { data });
});

const profile = catchAsync(async (req, res) => {
  const data = await Promise.all([categoryService.getAllCategorys(), userService.getUserById(req.userId)]);

  res.render('client/profile', { data: data[0], user: data[1] });
});

const payment = catchAsync(async (req, res) => {
  const data = await categoryService.getAllCategorys();

  res.render('client/payment', { data });
});

const paymentReturn = catchAsync(async (req, res) => {
  const data = await categoryService.getAllCategorys();

  let msg = await paymentService.vnpReturn(req);
  res.render('client/payment/result', { msg, data });
});

const logout = (req, res) => {
  res.clearCookie('tokens');

  res.redirect('/');
};

const forgotPassword = catchAsync(async (req, res) => {
  const data = await categoryService.getAllCategorys();
  res.render('client/forgotPassword', { data });
});

const resetPassword = catchAsync(async (req, res) => {
  const data = await categoryService.getAllCategorys();

  let { token = null } = req.query;

  if(!token)
    return res.redirect("/");
  
    try{
      await authService.resetPassword(token, '');
    }catch(err) {
      return res.render('client/resetPassword', {
        data,
        isValid: true,
        title: 'Đường dẫn khôi phục mật khẩu của bạn đã quá hạn, vui lòng thử lại',
      });
    }

  res.render('client/resetPassword', { data, isValid: false });
});

module.exports = {
  homePage,
  listProduct,
  productDetail,
  cart,
  checkout,
  blog,
  blogDetail,
  login,
  signup,
  profile,
  payment,
  paymentReturn,
  logout,
  forgotPassword,
  resetPassword,
};
