const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const categoryController = require('../../controllers/category.controller.js');

const router = express.Router();

router.route('/').post(categoryController.createCategory).get(categoryController.getCategorys);

router.route('/:categoryId').patch(categoryController.updateCategory).delete(categoryController.deleteCategory);

router.route('/:slug').get(categoryController.getCategoryBySlug);

module.exports = router;
