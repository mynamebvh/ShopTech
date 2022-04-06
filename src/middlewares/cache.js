const httpStatus = require('http-status');

const redisService = require('../services/redis.service');
const response = require('../utils/response');

const cache = (category, id) => async (req, res, next) => {
  const key = req.params[id];

  const value = await redisService.get(category, key);

  if (value) {
    return res.status(200).json(response(httpStatus.OK, 'Thành công', JSON.parse(value)));
  }

  next();
};

const clearCache = async (req, res, next) => {
  const { category, id } = res.locals;

  await redisService.deleteKey(category, id);
};

module.exports = { cache, clearCache };
