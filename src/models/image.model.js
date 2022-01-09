const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const imageSchema = mongoose.Schema(
  {
    path: {
      type: String,
      required: true,
      trim: true,
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
imageSchema.plugin(toJSON);
imageSchema.plugin(paginate);

/**
 * @typedef Image
 */
const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
