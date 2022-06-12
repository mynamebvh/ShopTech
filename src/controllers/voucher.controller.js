const httpStatus = require('http-status');

const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');

const { voucherService } = require('../services');

const createVoucher = catchAsync(async (req, res) => {
  const {name, desc, type,timeStart, timeEnd, discount,max, quantity} = req.body;
  const voucher = await voucherService.createVoucher({name, desc, type,timeStart, timeEnd, discount,max, quantity});
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, 'Thành công', voucher));
});

const getVouchers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const data = await voucherService.getVouchers(filter, options);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Thành công', data));
});

const updateVoucher = catchAsync(async (req, res) => {
  const {name, desc, type,timeStart, timeEnd, discount,max, quantity} = req.body;

  const voucher = await voucherService.updateVoucherById(req.params.voucherId, {name, desc, type,timeStart, timeEnd, discount,max, quantity});
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Cập nhật thành công', voucher));
});

const deleteVoucher = catchAsync(async (req, res) => {
  await voucherService.deleteVoucherById(req.params.voucherId);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Xoá thành công'));
});

module.exports = {
  createVoucher,
  getVouchers,
  updateVoucher,
  deleteVoucher,
};
