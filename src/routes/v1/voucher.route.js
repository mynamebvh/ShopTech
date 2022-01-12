const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const voucherController = require('../../controllers/voucher.controller');

const router = express.Router();

router.route('/').get(voucherController.getVouchers).post(voucherController.createVoucher);

router.route('/:voucherId').patch(voucherController.updateVoucher).delete(voucherController.deleteVoucher);

module.exports = router;
