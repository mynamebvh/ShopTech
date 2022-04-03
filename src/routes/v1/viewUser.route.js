const express = require('express');
// const { auth, authorize, refreshToken } = require('@middlewares/auth');
const { auth, authorize, refreshToken } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const viewUserController = require('../../controllers/viewUserController');

const router = express.Router();

router.route('/').get(viewUserController.homePage);

module.exports = router;
