const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const orderProductSchema = mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Số lượng phải lớn hơn 0'],
    },
    product: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
orderProductSchema.plugin(toJSON);
orderProductSchema.plugin(paginate);

/**
 * @typedef OrderProduct
 */
const OrderProduct = mongoose.model('OrderProduct', orderProductSchema);

module.exports = { OrderProduct, orderProductSchema };
