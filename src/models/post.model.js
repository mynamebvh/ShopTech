const mongoose = require('mongoose');
const slugify = require('slugify');

const { toJSON, paginate } = require('./plugins');

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: [10, 'Tiêu đề phải có ít nhất 10 từ'],
      unique: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minLength: [20, 'Nội dung phải có ít nhất 20 từ'],
    },
    slug: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
postSchema.plugin(toJSON);
postSchema.plugin(paginate);

/**
 * Check if title post is duplicate
 * @param {string} title - The title post
 * @returns {Promise<boolean>}
 */
postSchema.statics.isTitleDuplicate = async function (title) {
  const post = await this.findOne({ title });
  return !!post;
};

postSchema.pre('save', async function (next) {
  const post = this;
  if (post.isModified('title')) {
    post.slug = slugify(post.title);
  }
  next();
});

/**
 * @typedef Post
 */
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
