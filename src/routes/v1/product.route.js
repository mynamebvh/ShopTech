const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');

const { productController } = require('../../controllers');

const router = express.Router();

router.route('/').get(productController.getProducts).post(productController.createProduct);

router
  .route('/:productId')
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
