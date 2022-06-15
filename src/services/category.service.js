const httpStatus = require('http-status');
var mongoose = require('mongoose');

const { Category, Product } = require('../models/index');

const ApiError = require('../utils/ApiError');

/**
 * Query for category
 * @returns {Promise<Category>}
 */
const getCategorys = async (filter, options) => {
  const category = await Category.paginate(filter, options);
  return category;
};

const getAllCategorys = async () => {
  const category = await Category.find().lean();
  return category;
};

/**
 * Get category by slug
 * @returns {Promise<Category>}
 */
const getCategoryBySlug = async (filter, options, slug) => {
  // console.log(slug)
  const category = await Category.findOne({ slug });
  const products = await Product.paginate({ category: category._id }, options);

  return { category, products };
};

/**
 * Create a category
 * @param {Object} userBody
 * @returns {Promise<Category>}
 */
const createCategory = async (categoryBody) => {
  if (await Category.isNameDuplicate(categoryBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Tên thể loại đã tồn tại');
  }
  return Category.create(categoryBody);
};

/**
 * Get category by id
 * @param {ObjectId} id
 * @returns {Promise<Category>}
 */
const getCategoryById = async (id) => {
  return Category.findById(id);
};

/**
 * Update category by id
 * @param {ObjectId} categoryId
 * @param {Object} updateBody
 * @returns {Promise<Category>}
 */
const updateCategoryById = async (categoryId, updateBody) => {
  const category = await getCategoryById(categoryId);
  
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Thể loại không tồn tại');
  }

  if (updateBody.name && (await Category.isNameDuplicate(updateBody.name, category.id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Tên thể loại đã tồn tại');
  }

  Object.assign(category, updateBody);
  await category.save();
  return category;
};

/**
 * Delete category by id
 * @param {ObjectId} categoryId
 * @returns {Promise<Category>}
 */
const deleteCategoryById = async (categoryId) => {
  const category = await getCategoryById(categoryId);

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Thể loại không tồn tại');
  }
  await category.remove();
  return category;
};

module.exports = {
  getCategorys,
  getCategoryBySlug,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
  getAllCategorys,
};
