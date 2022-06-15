const mongoose = require('mongoose');
const slugify = require('slugify');

const { toJSON, paginate } = require('./plugins');

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên thể loại là bắt buộc"],
      trim: true,
      lowercase: true,
    },
    slug: {
      type: String,
    },
    desc: {
      type: String,
      required: [true, "Mô tả là bắt buộc"],
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
 * @param {ObjectId} categoryId
 * @returns {Promise<boolean>}
 */
categorySchema.statics.isNameDuplicate = async function (name, categoryId) {
  const category = await this.find({ name, _id: { $ne: categoryId } });
  return !!category.length;
};

/**
 * Check if category is duplicate
 * @param {ObjectId} id - The id category
 * @returns {Promise<boolean>}
 */
categorySchema.statics.isDuplicate = async function (categoryId) {
  const category = await this.findById({id: {$ne: categoryId}});
  return !!category;
};

categorySchema.pre('save', async function (next) {
  const category = this;
  if (category.isModified('name')) {
    category.slug = slugify(category.name);
  }
  next();
});

categorySchema.pre('find', async function (next) {
  // console.log('a', this.getOptions())
  next();
});

categorySchema.pre('findById', async function (next) {
  console.log('id', this.getOptions())
  next();
});
/**
 * @typedef Category
 */
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
