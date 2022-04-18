const express = require('express');
// const { auth, authorize, refreshToken } = require('@middlewares/auth');
const { auth, authorize, refreshToken } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const viewUserController = require('../../controllers/viewUser.controller');

const router = express.Router();

router.route('/').get(viewUserController.homePage);
router.route('/login').get(viewUserController.login);

router.route('/:category').get(viewUserController.listProduct);
router.route('/product/:slug').get(viewUserController.productDetail);
router.route('/cart').get(viewUserController.cart);
router.route('/checkout').get(viewUserController.checkout);
router.route('/blogs/:slug').get(viewUserController.blogDetail);
router.route('/blogs').get(viewUserController.blog);
router.route('/profile').get(viewUserController.profile);



module.exports = router;
