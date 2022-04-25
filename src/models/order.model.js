const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const orderSchema = mongoose.Schema(
  {
    customerAddress: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
      validate(value) {
        if (!value.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)) {
          throw new Error('Số điện thoại không đúng định dạng');
        }
      },
    },
    method_pay: {
      type: String,
      enum: ['COD', 'BANK'],
      default: 'COD',
    },
    status: {
      type: String,
      enum: ['Chờ xác nhận', 'Xác nhận', 'Giao hàng'],
      default: 'Chờ xác nhận',
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
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
