const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const orderController = require('../../controllers/order.controller');

const router = express.Router();

router.route('/').get(orderController.getOrders).post(orderController.createOrder);

router
  .route('/:orderId')
  .get(orderController.getOrder)
  .patch(orderController.updateOrder)
  .delete(orderController.deleteOrder);

module.exports = router;
