const httpStatus = require('http-status');
const axios = require('axios');

const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');
const { authService, userService, tokenService, emailService } = require('../services');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  //const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, 'Tạo thành công'));

});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);

  res.cookie('tokens', tokens, { signed: true, httpOnly: true });
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Thành công'));
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.signedCookies);
  res.cookie('tokens', tokens, { signed: true, httpOnly: true });
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Thành công'));
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);

  const data = await axios.post('http://localhost:5000/forgot-email', {
    type: 'FORGOT_PASSWORD',
    options: {
      email: req.body.email,
      subject: 'ShopTech - Khôi phục mật khẩu',
    },
    link: `localhost:3000/api/auth/forgot-password?=token=${resetPasswordToken}`,
  });
  // await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
