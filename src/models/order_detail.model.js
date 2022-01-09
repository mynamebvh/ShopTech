const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const oderDetailSchema = mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Số lượng phải lớn hơn 0'],
    },
    order: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Order',
      required: true,
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
oderDetailSchema.plugin(toJSON);
oderDetailSchema.plugin(paginate);

/**
 * @typedef OrderDetail
 */
const OrderDetail = mongoose.model('OrderDetail', oderDetailSchema);

module.exports = OrderDetail;
