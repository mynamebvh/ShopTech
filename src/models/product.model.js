const mongoose = require('mongoose');
const slugify = require('slugify');

const { toJSON, paginate } = require('./plugins');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
      minLength: [20, 'Mô tả phải có ít nhất 20 từ'],
    },
    manufacturer: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Số lượng phải lớn hơn 0'],
    },
    detail: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Category',
      required: true,
    },
    images: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: 'Image',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
productSchema.plugin(toJSON);
productSchema.plugin(paginate);

productSchema.statics.isNameDuplicate = async function (name) {
  const category = await this.findOne({ name });
  return !!category;
};

productSchema.pre('save', async function (next) {
  const product = this;
  if (product.isModified('name')) {
    product.slug = slugify(product.name);
  }
  next();
});

/**
 * @typedef Product
 */
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
