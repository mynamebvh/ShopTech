const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const orderSchema = mongoose.Schema(
  {
    phone: {
      type: String,
      trim: true,
      required: [true, 'Số điện thoại là bắt buộc'],
      validate(value) {
        if (!value.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)) {
          throw new Error('Số điện thoại không đúng định dạng');
        }
      },
    },
    methodPay: {
      type: String,
      enum: ['COD', 'BANK'],
      default: 'COD',
    },
    status: {
      type: String,
      enum: ['Chờ xác nhận', 'Xác nhận', 'Giao hàng', 'Huỷ bỏ', 'Thanh toán thành công'],
      default: 'Chờ xác nhận',
    },
    address: {
      type: String,
      required: [true, 'Địa chỉ là bắt buộc'],
      trim: true,
    },
    fullname: { type: String, required: [true, 'Họ tên là bắt buộc'], trim: true },
    note: { type: String, trim: true },
    txnRef: { type: String, trim: true },
    code: { type: String, trim: true },
  },

  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

/**
 * @typedef Order
 */
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
