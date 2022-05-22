const express = require('express');
const validate = require('../../middlewares/validate');
const { cache, clearCache } = require('../../middlewares/cache');
const authValidation = require('../../validations/auth.validation');
const sliderController = require('../../controllers/slider.controller');

const router = express.Router();

router.route('/').get(sliderController.getSliders).post(sliderController.createSlider);

router
  .route('/:sliderId')
  // .get(cache('post', 'postId'), postController.getPost)
  .patch(sliderController.updateSlider)
  .delete(sliderController.deleteSlider);

module.exports = router;
