const respone = (code, msg, data = []) => {
  return {
    code,
    msg,
    ...(data?.data ? data : { data: data }),
  };
};

module.exports = respone;
