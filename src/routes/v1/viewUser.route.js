const express = require('express');
// const { auth, authorize, refreshToken } = require('@middlewares/auth');
const { auth, authorize, refreshToken, authProduct } = require('../../middlewares/auth');

const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const { viewUserController, productController } = require('../../controllers');

const router = express.Router();

router.route('/login').get(viewUserController.login);
router.route('/signup').get(viewUserController.signup);
router.route('/logout').get(viewUserController.logout);
router.route('/forgot-password').get(viewUserController.forgotPassword);
router.route('/reset-password').get(viewUserController.resetPassword);

router.route('/checkout').get(viewUserController.checkout);
router.route('/blogs').get(viewUserController.blog);
router.route('/order').get(viewUserController.payment);
router.route('/payment_return').get(viewUserController.paymentReturn);
router.route('/s').get(productController.searchProduct);
router.route('/q').get(productController.searchProductView);
router.route('/blogs/:slug').get(viewUserController.blogDetail);
router.route('/product/:slug').get(authProduct, viewUserController.productDetail);
router.route('/cart').get(viewUserController.cart);
router.route('/profile').get(auth, viewUserController.profile);
router.route('/:category').get(viewUserController.listProduct);

router.route('/').get(viewUserController.homePage);

module.exports = router;
