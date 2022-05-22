const httpStatus = require('http-status');
const { Slider } = require('../models/index');
const { redisService, formdataService } = require('../services/index');
const ApiError = require('../utils/ApiError');

/**
 * Query for slider
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getSliders = async (filter, options) => {
  const slider = await Slider.paginate(filter, options);
  return slider;
};

/**
 * Create a slider
 * @param {Object} sliderBody
 * @returns {Promise<Slider>}
 */
const createSlider = async (sliderBody) => {

  return Slider.create(sliderBody);
};

/**
 * Get slider by id
 * @param {ObjectId} id
 * @returns {Promise<Slider>}
 */
const getSliderById = async (id) => {
  // await redisService.setex(`post`, id, '1m', await Post.findById(id));
  return Slider.findById(id);
};


/**
 * Update slider by id
 * @param {ObjectId} sliderId
 * @param {Object} updateBody
 * @returns {Promise<Slider>}
 */
const updateSliderById = async (sliderId, updateBody) => {
  console.log("id" ,sliderId )
  const slider = await getSliderById(sliderId);
  
  if (!slider) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Slider không tồn tại');
  }

  Object.assign(slider, updateBody);
  await slider.save();
  return slider;
};

/**
 * Delete slider by id
 * @param {ObjectId} sliderId
 * @returns {Promise<Slider>}
 */
const deleteSliderById = async (sliderId) => {
  console.log(sliderId)
  const slider = await getSliderById(sliderId);

  if (!slider) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Slider không tồn tại');
  }
  await slider.remove();
  return slider;
};

module.exports = {
  getSliders,
  createSlider,
  updateSliderById,
  deleteSliderById,
  getSliderById
};
