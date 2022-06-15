const httpStatus = require('http-status');
const formidable = require('formidable');

const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');

const KEY = 'slider'

const { sliderService, redisService, formDataService, imageService } = require('../services');

const createSlider = catchAsync(async (req, res) => {
  const body = await formDataService.parseForm(req);
  const { url } = await imageService.uploadImg(body.img.filepath);
  const { title, description, link } = body.fields;

  const slider = await sliderService.createSlider({ title, description, url: url, link });
  await redisService.del(KEY)
       
  res.status(httpStatus.CREATED).json(response(httpStatus.CREATED, 'Thành công'));
});

const getSlider = catchAsync(async (req, res) => {
  const { postId } = req.params;
  // let postCache = await redisService.getValueByField('posts', postId);

  // if (postCache) {
  //   res.status(httpStatus.OK).json(response(httpStatus.OK, 'Thành công', JSON.parse(postCache)));
  //   return;
  // }

  const post = await postService.getPostById(postId);
  // await redisService.saveTypeHashes('posts', post._id.toString(), post);
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Thành công', post));
});

const getSliders = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const { length, start } = req.query;
  options.page = start / length + 1;
  options.limit = length;

  let resultCache = await redisService.hGet(KEY, {...filter, ...options, length, start })
  if(resultCache) {
    console.log('cache')
    return res.status(httpStatus.OK).json(response(httpStatus.OK, 'Thành công',resultCache));
  }

  const data = await sliderService.getSliders(filter, options);
  await redisService.hSet(KEY, {...filter, ...options, length, start}, data);

  data.draw = parseInt(req.query.draw);

  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Thành công', data));
});

const updateSlider = catchAsync(async (req, res, next) => {
  const body = await formDataService.parseForm(req);
  let url;
  if(body.img){
    let i = await imageService.uploadImg(body.img.filepath);
    url = i.url;
  }

  const { title, description, link } = body.fields;
  const { sliderId } = req.params;

  const updateBody = {
    title,
    description,
    link,
  };

  if (!url) {
    delete updateBody.url;
  }else {
    updateBody.url = url;
  }

  const slider = await sliderService.updateSliderById(sliderId, updateBody);

  await redisService.del(KEY)
  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Cập nhật thành công', slider));
  next();
});

const deleteSlider = catchAsync(async (req, res) => {
  await sliderService.deleteSliderById(req.params.sliderId);
  await redisService.del(KEY)

  res.status(httpStatus.OK).json(response(httpStatus.OK, 'Xoá thành công'));
});

module.exports = {
  createSlider,
  deleteSlider,
  getSliders,
  updateSlider,
};
