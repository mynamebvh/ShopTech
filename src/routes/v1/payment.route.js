const express = require('express');
const validate = require('../../middlewares/validate');
const { cache, clearCache } = require('../../middlewares/cache');
const authValidation = require('../../validations/auth.validation');
const paymentController = require('../../controllers/payment.controller');

const router = express.Router();

router.route('/').post(paymentController.createPaymentUrl);


module.exports = router;
