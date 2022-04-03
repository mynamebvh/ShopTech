const express = require('express');

const viewUserRoute = require('./viewUser.route');

const config = require('../../config/config');
const { auth, authorize } = require('../../middlewares/auth');

const router = express.Router();

const viewRoutes = [
  {
    path: '/',
    route: viewUserRoute,
  },
];

viewRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
