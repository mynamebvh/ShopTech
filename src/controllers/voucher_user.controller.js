const httpStatus = require('http-status');

const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');

const { voucherService } = require('../services');

const getVoucherByCode = catchAsync(async (req, res) => {
  const data = await voucherService.getVoucherByCode(req.query.q);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Thành công', data));
});

module.exports = {
  getVoucherByCode
};