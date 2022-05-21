const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');

const catchAsync = require('../utils/catchAsync');
const { tokenService } = require('../services');
const { tokenTypes } = require('../config/tokens');

const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');

const auth = (req, res, next) => {
  let tokens = req.signedCookies?.tokens;

  if (!tokens) {
    return next(new Error('Cookie không tìm thấy'));
  }

  if (!tokens) {
    return res.redirect('/');
  }

  let { access } = tokens;

  const payload = jwt.verify(access.token, config.jwt.secret);

  if (payload) {
    req.userId = payload.sub;
    return next();
  }
};

const authProduct = (req, res, next) => {
  let tokens = req.signedCookies?.tokens;

  if (!tokens) {
    req.auth = false;
    return next();
  }

  let { access } = tokens;

  const payload = jwt.verify(access.token, config.jwt.secret);

  if (payload) {
    req.userId = payload.sub;
    req.auth = true;

    return next();
  }
};

const authorize = (role, type) => async (req, res, next) => {
  const user = await User.findById(req.userId);

  if (user) if (user.role === role) return next();

  if (type === 'render') {
    return res.redirect('/admin');
  }

  next(new ApiError(httpStatus.FORBIDDEN, 'Không có quyền'));
};

module.exports = { auth, authorize, authProduct };
