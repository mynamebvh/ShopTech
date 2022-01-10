const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');

const catchAsync = require('../utils/catchAsync');
const { tokenService } = require('../services');
const { tokenTypes } = require('../config/tokens');

const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');

const getCookie = (req, type) => {
  let token = req.signedCookies?.token;

  if (!token) {
    return new ApiError(httpStatus.UNAUTHORIZED, 'Lỗi xác thực');
  }

  return token[type];
};

const auth = (req, res, next) => {
  let accessToken = getCookie(req, tokenTypes.ACCESS);

  if (accessToken instanceof ApiError) {
    return next(accessToken);
  }

  const payload = jwt.verify(accessToken.token, config.jwt.secret);

  if (payload) {
    req.userId = payload.sub;
    return next();
  }
};

const authorize = (role) => async (req, res, next) => {
  const user = await User.findById(req.userId);

  if (user) if (user.role === role) return next();

  next(new ApiError(httpStatus.FORBIDDEN, 'Không có quyền'));
};

const refreshToken = catchAsync(async (err, req, res, next) => {
  console.log('hello');

  if (err.message == 'jwt expired') {
    let refreshToken = getCookie(req, tokenTypes.REFRESH);

    if (refreshToken instanceof ApiError) {
      throw refreshToken;
    }

    let doc = await tokenService.verifyToken(refreshToken.token, tokenTypes.REFRESH);

    if (doc) {
      req.userId = doc.user;
      return next();
    }
  }

  next();
});
module.exports = { auth, authorize, refreshToken };
