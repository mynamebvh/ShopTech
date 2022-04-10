const formidable = require('formidable');

/** parse form data
 *
 * @param {Request} req
 * @returns {Promise<Object>}
 */
 const parseForm = async (req) => {
  const form = formidable({
    multiples: true,
    maxFiles: 2,
    maxFileSize: 1024 * 1024 * 10,
    filter: function ({ name, originalFilename, mimetype }) {
      // keep only images
      if (!mimetype.includes('image')) throw Error('Định dạng hỗ trợ là file ảnh');
      return mimetype && mimetype.includes('image');
    },
  });

  return new Promise(function (resolve, reject) {
    form.parse(req, function (err, fields, files) {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, ...files });
    });
  });
};

module.exports = {
  parseForm
};