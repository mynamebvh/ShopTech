const express = require('express');
// const { auth, authorize, refreshToken } = require('@middlewares/auth');
const { auth, authorize, refreshToken } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const viewAdminController = require('../../controllers/viewAdmin.controller');

const router = express.Router();

router.route('/dashboard').get(auth, authorize('admin', 'render'), viewAdminController.homePage);
router.route('/manage-product').get(auth, authorize('admin', 'render'), viewAdminController.manageProduct);
router.route('/manage-product/create').get(auth, authorize('admin', 'render'), viewAdminController.createProduct);
router.route('/manage-product/edit/:id').get(auth, authorize('admin', 'render'), viewAdminController.editProduct);

router.route('/manage-voucher').get(auth, authorize('admin', 'render'), viewAdminController.manageVoucher);


router.route('/manage-category').get(auth, authorize('admin', 'render'), viewAdminController.manageCategory);
router.route('/manage-user').get(auth, authorize('admin', 'render'), viewAdminController.manageUser);
router.route('/manage-blog/create').get(auth, authorize('admin', 'render'), viewAdminController.createArticles);
router.route('/manage-blog/edit/:id').get(auth, authorize('admin', 'render'), viewAdminController.editArticles);

router.route('/manage-blog').get(auth, authorize('admin', 'render'), viewAdminController.manageBlog);

router.route('/manage-checkout').get(auth, authorize('admin', 'render'), viewAdminController.manageCheckout);
router.route('/manage-slider').get(auth, authorize('admin', 'render'), viewAdminController.manageSlider);
router.route('/manage-slider/create').get(auth, authorize('admin', 'render'), viewAdminController.createSlider);
router.route('/manage-slider/edit/:id').get(auth, authorize('admin', 'render'), viewAdminController.editSlider);

router.route('/').get(viewAdminController.loginPage);

module.exports = router;
