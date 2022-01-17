const httpStatus = require('http-status');

const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');

const { imageService } = require('../services');

const createImage = catchAsync(async (req, res) => {
  const image = await imageService.createImage(req);
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, 'Thành công', image));
});

const deleteImage = catchAsync(async (req, res) => {
  await imageService.deleteImageByProductId(req.params.productId);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Xoá thành công'));
});

module.exports = { createImage, deleteImage };
