const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const imageController = require('../../controllers/image.controller');

const router = express.Router();

router.route('/').post(imageController.createImage);

router.route('/:productId').delete(imageController.deleteImage);

module.exports = router;
