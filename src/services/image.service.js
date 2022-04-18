const httpStatus = require('http-status');
const cloudinary = require('cloudinary').v2;
const formidable = require('formidable');

const { formDataService } = require('../services');
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

/**
 * Create a image
 * @param {Object} req
 * @returns {Promise<Image>}
 */
const createImage = async (req) => {
  const images = [];

  const { fields, files } = await formDataService.parseForm(req);

  const imgClouds = files.map(
    async (img) => await cloudinary.uploader.upload(img.filepath, { folder: 'product', tags: 'basic_sample' })
  );

  let a = await Promise.all(imgClouds);

  a.forEach((a) => {
    images.push({ path: a.url, product: fields.product });
  });

  return Image.insertMany(images);
};

const uploadImg = async (path) => {
  if (!path) return { url: null };

  return await cloudinary.uploader.upload(path, { folder: 'blog', tags: 'basic_sample' });
};


const uploadImgs = async (fileArr) => {
  if (!fileArr) return { url: null };

  if(fileArr.length == 0 || fileArr.length > 5){
    return { url: null };
  }
  const result = fileArr.map(file => cloudinary.uploader.upload(file.filepath, { folder: 'products', tags: 'basic_sample' }))
  return await Promise.all(result);
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
  uploadImg,
  uploadImgs
};
