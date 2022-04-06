const express = require('express');
// const { auth, authorize, refreshToken } = require('@middlewares/auth');
const { auth, authorize, refreshToken } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const viewUserController = require('../../controllers/viewUserController');

const router = express.Router();

router.route('/').get(viewUserController.homePage);
router.route('/login').get(viewUserController.login);

router.route('/list').get(viewUserController.listProduct);
router.route('/product').get(viewUserController.productDetail);
router.route('/cart').get(viewUserController.cart);
router.route('/checkout').get(viewUserController.checkout);
router.route('/blog').get(viewUserController.blog);
router.route('/blog_detail').get(viewUserController.blogDetail);

module.exports = router;
