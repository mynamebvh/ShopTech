const httpStatus = require('http-status');


const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');

const { paymentService } = require('../services');

const createPaymentUrl = catchAsync(async (req, res) => {
  res.redirect(paymentService.createPaymentUrl(req))
});



module.exports = {
  createPaymentUrl
};


