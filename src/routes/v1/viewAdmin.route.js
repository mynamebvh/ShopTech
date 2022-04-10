const express = require('express');
// const { auth, authorize, refreshToken } = require('@middlewares/auth');
const { auth, authorize, refreshToken } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const viewAdminController = require('../../controllers/viewAdminController');

const router = express.Router();

router.route('/dashboard').get(auth, viewAdminController.homePage);
router.route('/manage-product').get(auth, viewAdminController.manageProduct);
router.route('/manage-category').get(auth, viewAdminController.manageCategory);
router.route('/manage-user').get(auth, viewAdminController.manageUser);
router.route('/manage-blog/create').get(viewAdminController.createArticles);
router.route('/manage-blog').get(viewAdminController.manageBlog);


router.route('/').get(viewAdminController.loginPage);

module.exports = router;
