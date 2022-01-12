const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const voucherSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
      minLength: [20, 'Mô tả phải có ít nhất 20 từ'],
    },
    code: {
      type: String,
      trim: true,
      required: true,
    },
    timeStart: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    timeEnd: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      min: [1, 'Phải lớn hơn 0'],
    },
    category: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
voucherSchema.plugin(toJSON);
voucherSchema.plugin(paginate);

/**
 * Check if code voucher is duplicate
 * @param {string} code - The code voucher
 * @returns {Promise<boolean>}
 */
voucherSchema.statics.isCodeDuplicate = async function (code) {
  const voucher = await this.findOne({ code });
  return !!voucher;
};

/**
 * @typedef Voucher
 */
const Voucher = mongoose.model('Voucher', voucherSchema);

module.exports = Voucher;
