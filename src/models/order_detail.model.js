const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');
const { orderProductSchema } = require('../models/order_product.model');

const orderDetailSchema = mongoose.Schema(
  {
    order: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Order',
      required: true,
    },
    products: {
      type: [orderProductSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
orderDetailSchema.plugin(toJSON);
orderDetailSchema.plugin(paginate);

/**
 * @typedef OrderDetail
 */
const OrderDetail = mongoose.model('OrderDetail', orderDetailSchema);

module.exports = OrderDetail;
