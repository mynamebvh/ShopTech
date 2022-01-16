const httpStatus = require('http-status');

// const { categoryService } = require('../services');
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const ApiError = require('../utils/ApiError');

/**
 * Query for product
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getProducts = async (filter, options) => {
  const product = await Product.paginate(filter, options);
  return product;
};

/**
 * Create a product
 * @param {Object} productBody
 * @returns {Promise<Product>}
 */
const createProduct = async (productBody) => {
  if (!(await Category.isDuplicate(productBody.category))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Thể loại chưa tồn tại');
  }

  if (await Product.isNameDuplicate(productBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Sản phẩm đã tồn tại');
  }

  return Product.create(productBody);
};

/**
 * Get product by id
 * @param {ObjectId} id
 * @returns {Promise<Product>}
 */
const getProductById = async (id) => {
  return Product.findById(id);
};

/**
 * Update product by id
 * @param {ObjectId} productId
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
const updateProductById = async (productId, updateBody) => {
  const product = await getProductById(productId);

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sản phẩm không tồn tại');
  }

  if (updateBody.name && (await Product.isNameDuplicate(updateBody.name))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Tên sản phẩm đã tồn tại');
  }

  Object.assign(product, updateBody);
  await product.save();
  return product;
};

/**
 * Delete product by id
 * @param {ObjectId} productId
 * @returns {Promise<Product>}
 */
const deleteProductById = async (productId) => {
  const product = await getProductById(productId);

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sản phẩm không tồn tại');
  }
  await product.remove();
  return product;
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
};
