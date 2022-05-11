const dateFormat = require('dateformat');
// import dateFormat, { masks } from "dateformat";
const querystring = require('qs');
const crypto = require('crypto');

const sortObject = require('../utils/sortObject');
const config = require('../config/config');

/**
 * Generate url payment
 * @param {Object} req // request
 * @returns {String}
 */
const createPaymentUrl = async (req) => {
  const { amount, bankCode, orderInfo } = req.body;
  const ipAddr =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  const tmnCode = config.vnpTmnCode;
  const secretKey = config.vnpHashSecret;
  const vnpUrl = config.vnpUrl;
  const returnUrl = config.vnpReturnUrl;

  const date = new Date();

  const createDate = dateFormat(date, 'yyyymmddHHmmss');
  const orderId = dateFormat(date, 'HHmmss');

  const orderType = 'billpayment';
  const locale = 'vn';
  const currCode = 'VND';
  const vnp_Params = {};

  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  // vnp_Params['vnp_Merchant'] = ''
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = orderInfo;
  vnp_Params['vnp_OrderType'] = orderType;
  vnp_Params['vnp_Amount'] = amount * 100;
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  if (bankCode !== null && bankCode !== '') {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
  vnp_Params['vnp_SecureHash'] = signed;
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

  return vnpUrl;
};

/**
 * Order processing
 * @param {Object} req // request
 * @returns {boolean}
 */
const vnpReturn = (req) => {
  let vpnParams = req.query;

  const secureHash = vpnParams['vnp_SecureHash'];

  delete vpnParams['vnp_SecureHash'];
  delete vpnParams['vnp_SecureHashType'];

  vpnParams = sortObject(vpnParams);

  const tmnCode = config.vnpTmnCode;
  const secretKey = config.vnpHashSecret;

  const signData = querystring.stringify(vpnParams, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

  if (secureHash === signed) {
    

    return true;
  } else {
    return false;
  }
};

module.exports = {
  createPaymentUrl,
  vnpReturn
};
