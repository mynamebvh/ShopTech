const express = require('express');

const viewUserRoute = require('./viewUser.route');
const viewAdminRoute = require('./viewAdmin.route');

const config = require('../../config/config');
const { auth, authorize } = require('../../middlewares/auth');

const router = express.Router();

router.use('/admin', viewAdminRoute);
router.use('/', viewUserRoute);

module.exports = router;
