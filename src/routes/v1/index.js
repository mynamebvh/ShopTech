const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const categoryRoute = require('./category.route');
const voucherRoute = require('./voucher.route');
const docsRoute = require('./docs.route');
const config = require('@config/config');
const { auth, authorize } = require('@middlewares/auth');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/categorys',
    route: categoryRoute,
  },
];

const adminRoutes = [
  {
    path: '/vouchers',
    route: voucherRoute,
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
