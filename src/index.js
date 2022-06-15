const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const redis = require('./config/redis');

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});

//redis cache
// mongoose.Query.prototype.cache = function (time = 3600) {
//   this.cache = true;
//   this.cacheTime = time;
//   return this;
// };

// async function clearCachedData(collectionName, op) {
//   const allowedCacheOps = ['find', 'findById', 'findOne'];
//   // console.log(collectionName);
//   if (!allowedCacheOps.includes(op) && (await redis.EXISTS(collectionName))) {
//     redis.DEL(collectionName);
//   }
// }

// const exec = mongoose.Query.prototype.exec;
// mongoose.Query.prototype.exec = async function () {
//   const collectionName = this.mongooseCollection.name;
//   let seft = this;
//   if (this.cache) {
//     const key = JSON.stringify({ ...this.getOptions(), collectionName: collectionName, op: this.op });
//     const cachedResults = await redis.HGET(collectionName, key);

//     if (cachedResults) {
//       const result = JSON.parse(cachedResults);

//       // console.log(this.model);

//       if (Array.isArray(result)) {
//         // console.log(result.map((d) => new this.model(d)));
//         return result.map((d) => new this.model(d));
//       }

//       console.log( new this.model(result))
//       return new this.model(result);
//     }
//     const result = await exec.apply(this, arguments);
//     redis.HSET(collectionName, key, JSON.stringify(result), 'EX', this.cacheTime);
//     return result;
//   }

//   clearCachedData(collectionName, this.op);
//   return exec.apply(this, arguments);
// };

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
