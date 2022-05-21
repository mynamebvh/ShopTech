const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
      enum: ['nam', 'nữ', 'khác'],
      default: 'khác',
    },
    amount: {
      type: Number,
      default: 0,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email không hợp lệ');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Mật khẩu phải chứa ít nhất 1 chữ số, 1 chữ hoa, độ dài tối thiểu 8 kí tự');
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    phone: {
      type: String,
      trim: true,
      validate(value) {
        if (!value.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)) {
          throw new Error('Số điện thoại không đúng định dạng');
        }
      },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
    },
    address: {
      type: String,
      trim: true
    },
    career: {
      type: String,
      trim: true,
      default: "Người dùng"
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  // if (user.isModified('gender')) {
  //   if(user.gender == "nam"){
  //     user.avatar = "/static/client/images/user/men.jpg"
  //   }else {
  //     user.avatar = "/static/client/images/user/woman.jpg"
  //   }
  // }

  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
