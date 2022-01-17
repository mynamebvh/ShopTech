const httpStatus = require('http-status');

const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');

const { categoryService } = require('../services');

const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, 'Thành công', category));
});

const getCategorys = catchAsync(async (req, res) => {
  const result = await categoryService.getCategorys();
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Thành công', result));
});

const getCategoryBySlug = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const category = await categoryService.getCategoryBySlug(filter, options, req.params.slug);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Thể loại không tồn tại');
  }
  res.send(category);
});

const updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategoryById(req.params.categoryId, req.body);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Cập nhật thành công', category));
});

const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategoryById(req.params.categoryId);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Xoá thành công'));
});

module.exports = {
  createCategory,
  getCategoryBySlug,
  getCategorys,
  updateCategory,
  deleteCategory,
};
