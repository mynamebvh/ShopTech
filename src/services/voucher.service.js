const httpStatus = require('http-status');
const dayjs = require('dayjs')


const randomstring = require('randomstring');

const Voucher = require('../models/voucher.model');
const ApiError = require('../utils/ApiError');

/**
 * Query for voucher
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getVouchers = async (filter, options) => {
  const voucher = await Voucher.paginate(filter, options);
  return voucher;
};

/**
 * Generate random code voucher
 * @param {String} code
 * @returns {String}
 */
const generateCodeVoucher = ({ code }) => {
  if (!code) {
    return randomstring.generate(10);
  }

  return code;
};

/**
 * Create a voucher
 * @param {Object} voucherBody
 * @returns {Promise<Voucher>}
 */
const createVoucher = async (voucherBody) => {

  voucherBody.code = generateCodeVoucher(voucherBody);

  voucherBody.timeStart = dayjs(voucherBody.timeStart.split("/").reverse().join("-")).toDate();
  voucherBody.timeEnd = dayjs(voucherBody.timeEnd.split("/").reverse().join("-")).toDate();
  voucherBody.max = parseInt(voucherBody.max.replaceAll(".",""))
  
  if (await Voucher.isCodeDuplicate(voucherBody.code)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Mã khuyến mại đã tồn tại');
  }

  return Voucher.create(voucherBody);
};

/**
 * Get voucher by id
 * @param {ObjectId} id
 * @returns {Promise<Voucher>}
 */
const getVoucherById = async (id) => {
  return Voucher.findById(id);
};

/**
 * Get voucher by code
 * @param {String} code
 * @returns {Promise<Voucher>}
 */
 const getVoucherByCode = async (code) => {
  return Voucher.findOne({
    $and: [
      { code },
      { quantity: { $gte: 1 } },
      { timeStart: { $lte: Date.now() } },
      { timeEnd: { $gte: Date.now() }},
    ]
  });
};

/**
 * Get voucher by code admin
 * @param {String} code
 * @returns {Promise<Voucher>}
 */
 const getVoucherByCodeAdmin = async (code) => {
  return Voucher.findOne({ code });
};

/**
 * Update voucher by id
 * @param {ObjectId} voucherId
 * @param {Object} updateBody
 * @returns {Promise<Voucher>}
 */
const updateVoucherById = async (voucherId, updateBody) => {
  const voucher = await getVoucherById(voucherId);

  if (!voucher) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mã giảm giá không tồn tại');
  }

  updateBody.timeStart = dayjs(updateBody.timeStart.split("/").reverse().join("-")).toDate();
  updateBody.timeEnd = dayjs(updateBody.timeEnd.split("/").reverse().join("-")).toDate();
  updateBody.max = parseInt(updateBody.max.replaceAll(".",""))
  // updateBody.code = generateCodeVoucher(updateBody);

  // if (updateBody.name && (await Voucher.isCodeDuplicate(updateBody.code))) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Mã khuyến mại đã tồn tại');
  // }

  Object.assign(voucher, updateBody);
  await voucher.save();
  return voucher;
};

const updateVoucherQuantityByCode = async (code) => {
  const voucher = await Voucher.findOne({ code });

  if (!voucher) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mã giảm giá không tồn tại');
  }

  // updateBody.quantity =;
  Object.assign(voucher, {quantity: voucher.quantity - 1});
  await voucher.save();
  return voucher;
};

/**
 * Delete voucher by id
 * @param {ObjectId} voucherId
 * @returns {Promise<Voucher>}
 */
const deleteVoucherById = async (voucherId) => {
  const voucher = await getVoucherById(voucherId);

  if (!voucher) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Thể loại không tồn tại');
  }
  await voucher.remove();
  return voucher;
};

module.exports = {
  getVouchers,
  getVoucherByCode,
  createVoucher,
  updateVoucherById,
  deleteVoucherById,
  updateVoucherQuantityByCode,
  getVoucherByCodeAdmin
};
