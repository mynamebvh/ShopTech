const httpStatus = require('http-status');
const cloudinary = require('cloudinary').v2;
const formidable = require('formidable');

const { productService } = require('../services');
const config = require('../config/config.js');
const Image = require('../models/image.model');
const Product = require('../models/product.model');
const ApiError = require('../utils/ApiError');

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true,
});

/** parse form data
 *
 * @param {Request} req
 * @returns {Promise<Object>}
 */
const parseForm = async (req) => {
  const form = formidable({
    multiples: true,
    maxFiles: 2,
    maxFileSize: 1024 * 1024 * 10,
    filter: function ({ name, originalFilename, mimetype }) {
      // keep only images
      if (!mimetype.includes('image')) throw Error('Định dạng hỗ trợ là file ảnh');
      return mimetype && mimetype.includes('image');
    },
  });

  return new Promise(function (resolve, reject) {
    form.parse(req, function (err, fields, files) {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, ...files });
    });
  });
};

/**
 * Create a image
 * @param {Object} req
 * @returns {Promise<Image>}
 */
const createImage = async (req) => {
  const images = [];

  const { fields, files } = await parseForm(req);

  const imgClouds = files.map(
    async (img) => await cloudinary.uploader.upload(img.filepath, { folder: 'product', tags: 'basic_sample' })
  );

  let a = await Promise.all(imgClouds);

  a.forEach((a) => {
    images.push({ path: a.url, product: fields.product });
  });

  return Image.insertMany(images);
};

/**
 * Get image by id
 * @param {ObjectId} id
 * @returns {Promise<Image>}
 */
const getProductById = async (id) => {
  return Product.findById(id);
};

/**
 * Delete image by id
 * @param {ObjectId} productId
 * @returns {Promise<Product>}
 */
const deleteImageByProductId = async (productId) => {
  const product = await getProductById(productId);

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sản phẩm không tồn tại');
  }

  await Image.deleteMany({ product: productId });
  return null;
};

module.exports = {
  createImage,
  deleteImageByProductId,
};
