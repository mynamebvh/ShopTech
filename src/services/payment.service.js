const dateFormat = require('dateformat');
// import dateFormat, { masks } from "dateformat";
const querystring = require('qs');
const crypto = require('crypto');

const sortObject = require('../utils/sortObject');
const pick = require('../utils/pick');

const config = require('../config/config');
const { orderService, orderDetailService } = require('./index');

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

  const { vnpay } = config;
  const tmnCode = vnpay.vnpTmnCode;
  const secretKey = vnpay.vnpHashSecret;
  let vnpUrl = vnpay.vnpUrl;
  const returnUrl = vnpay.vnpReturnUrl;

  const date = new Date();

  const createDate = dateFormat(date, 'yyyymmddHHmmss');
  const orderId = dateFormat(date, 'HHmmss');

  let order = await orderService.createOrder({ ...req.body, txnRef: orderId });

  const postBody = pick(req.body, ['products']);
  postBody.order = order.id;
  await orderDetailService.createOrderDetail(postBody);

  const { total } = await orderDetailService.getOrdersDetailByOrderId(order.id);

  const orderType = 'billpayment';
  const locale = 'vn';
  const currCode = 'VND';
  let vnp_Params = {};

  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  // vnp_Params['vnp_Merchant'] = ''
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = orderInfo;
  vnp_Params['vnp_OrderType'] = orderType;
  vnp_Params['vnp_Amount'] = (total - (total * 0.08)) * 100;
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  vnp_Params['vnp_BankCode'] = 'NCB';

  // if (bankCode !== null && bankCode !== '') {
  //   vnp_Params['vnp_BankCode'] = bankCode;
  // }

  vnp_Params = sortObject(vnp_Params);

  console.log(vnp_Params);
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
const vnpReturn = async (req) => {
  let vpnParams = req.query;

  const secureHash = vpnParams['vnp_SecureHash'];

  delete vpnParams['vnp_SecureHash'];
  delete vpnParams['vnp_SecureHashType'];

  vpnParams = sortObject(vpnParams);

  const { vnpay } = config;
  const tmnCode = vnpay.vnpTmnCode;
  const secretKey = vnpay.vnpHashSecret;

  const signData = querystring.stringify(vpnParams, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

  if (secureHash === signed) {
    await orderService.updateStatusByTxnRef(vpnParams['vnp_TxnRef']);
    return 'Giao dịch thành công';
  } else {
    return 'Giao dịch thất bại';
  }
};

module.exports = {
  createPaymentUrl,
  vnpReturn,
};
