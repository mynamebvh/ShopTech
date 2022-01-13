const client = require('../config/redis');

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
  saveTypeHashes,
  getValueByField,
  getValueByKey,
};
