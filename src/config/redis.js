const { createClient } = require('redis');

const client = createClient();

client.on('connect', () => console.log(`Redis connected`));

client.on('error', (err) => console.log('Redis Client Error', err));

client.connect();

module.exports = client;
