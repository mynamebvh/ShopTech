const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const orderDetailController = require('../../controllers/order_detail.controller');

const router = express.Router();

router.route('/').get(orderDetailController.getOrderDetails).post(orderDetailController.createOrderDetail);

router.route('/:id').get(orderDetailController.getOrdersDetailByOrderId);
// .patch(postController.updatePost)

module.exports = router;
