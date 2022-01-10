const respone = (statusCode, msg, data = []) => {
  return {
    statusCode,
    msg,
    data,
  };
};

module.exports = respone;
