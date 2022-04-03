const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const homePage = catchAsync(async (req, res) => {
  res.render('client/home');
});

module.exports = { homePage };
