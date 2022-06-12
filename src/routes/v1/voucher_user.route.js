const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const voucherController = require('../../controllers/voucher_user.controller');

const router = express.Router();

router.route('/').post(voucherController.getVoucherByCode);
module.exports = router;
