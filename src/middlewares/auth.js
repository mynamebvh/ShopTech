const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');

const auth = (req, res, next) => {
  let token = req.signedCookies?.token;

  if (!token) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Lỗi xác thực'));
  }

  const { access, refresh } = token;

  const payload = jwt.verify(access.token, config.jwt.secret);

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

module.exports = { auth, authorize };
