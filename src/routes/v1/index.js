const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const categoryRoute = require('./category.route');
const voucherRoute = require('./voucher.route');
const postRoute = require('./post.route');
const productRoute = require('./product.route');
const orderRoute = require('./order.route');
const imageRoute = require('./image.route');
const commentRoute = require('./comment.route');
const orderDetailRoute = require('./order_detail.route');

const docsRoute = require('./docs.route');
const config = require('../../config/config');
const { auth, authorize } = require('../../middlewares/auth');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },

  {
    path: '/categorys',
    route: categoryRoute,
  },
  {
    path: '/orders',
    route: orderRoute,
  },
];

const userRoutes = [
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/comments',
    route: commentRoute,
  },
  { path: '/order-detail', route: orderDetailRoute },
];

const adminRoutes = [
  {
    path: '/vouchers',
    route: voucherRoute,
  },
  {
    path: '/posts',
    route: postRoute,
  },
  {
    path: '/products',
    route: productRoute,
  },
  {
    path: '/images',
    route: imageRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

userRoutes.forEach((route) => {
  router.use(route.path, auth, route.route);
});

adminRoutes.forEach((route) => {
  router.use(route.path, auth, authorize('admin'), route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
