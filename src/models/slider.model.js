const mongoose = require('mongoose');

const { toJSON, paginate } = require('./plugins');

const sliderSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      // maxLength: [10, 'Tiêu đề tối đa 10 kí tự'],
      unique: true,
    },
    description: {
      trim: true,
      type: String,
    },
    url: {
      type: String,
      required: [true, 'Ảnh là bắt buộc'],
    },
    isShow: {
      type: Boolean,
      default: true
    },
    link: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
sliderSchema.plugin(toJSON);
sliderSchema.plugin(paginate);

/**
 * @typedef Slider
 */
const Slider = mongoose.model('Slider', sliderSchema);

module.exports = Slider;
