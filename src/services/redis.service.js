const client = require('../config/redis');

/**
 * Convert ex string to second
 * @param {string} ex
 * @returns {number}
 */
const convertExToSecond = (ex) => {
  const type = ex.substring(ex.length - 1);
  const exNum = parseInt(ex.split(type)[0]);

  switch (type) {
    case 's':
      return exNum;
      break;
    case 'm':
      return exNum * 60;
    case 'h':
      return exNum * 3600;
    default:
      throw new Error('Type ex not exist');
      break;
  }
};

/* 
  =============================
  ======Redis Type String======
  =============================
*/

/**
 * Set value using redis setex
 * @param {string} category
 * @param {string} key
 * @param {string} ex
 * @param {Object} value
 * @returns {Promise<>}
 */
const setex = async (category, key, ex, value) => {
  return await client.setEx(`${category}:${key}`, convertExToSecond(ex), JSON.stringify(value));
};

/**
 * get value using redis get
 * @param {string} category
 * @param {string} key
 * @returns {Promise<>}
 */
const get = async (category, key) => {
  return await client.get(`${category}:${key}`);
};

/* 
  =============================
  ======Redis Type Hashes======
  =============================
*/

/**
 * Save value redis type hashes
 * @param {string} key
 * @param {string} field
 * @param {Object} value
 * @returns {Promise<Object>}
 */
const saveTypeHashes = async (key, field, value) => {
  return await client.hSet(key, field, JSON.stringify(value));
};

/**
 * Get value
 * @param {string} key
 * @param {number} cursor
 * @returns {Promise<Object>}
 */
const getValueByKey = async (key, cursor = 0) => {
  return await client.hScan(key, cursor);
};

/**
 * Get value by field
 * @param {string} key
 * @param {string} field
 * @returns {Promise<Object>}
 */
const getValueByField = async (key, field) => {
  return await client.hGet(key, field);
};

module.exports = {
  get,
  setex,
  saveTypeHashes,
  getValueByField,
  getValueByKey,
};
