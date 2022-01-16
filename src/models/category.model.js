const mongoose = require('mongoose');
const slugify = require('slugify');

const { toJSON, paginate } = require('./plugins');

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    slug: {
      type: String,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
      minLength: [20, 'Mô tả phải có ít nhất 20 từ'],
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);

/**
 * Check if name category is duplicate
 * @param {string} name - The name category
 * @returns {Promise<boolean>}
 */
categorySchema.statics.isNameDuplicate = async function (name) {
  const category = await this.findOne({ name });
  return !!category;
};

/**
 * Check if category is duplicate
 * @param {ObjectId} id - The id category
 * @returns {Promise<boolean>}
 */
categorySchema.statics.isDuplicate = async function (id) {
  const category = await this.findById(id);
  return !!category;
};

categorySchema.pre('save', async function (next) {
  const category = this;
  if (category.isModified('name')) {
    category.slug = slugify(category.name);
  }
  next();
});

/**
 * @typedef Category
 */
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
