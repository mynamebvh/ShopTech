const httpStatus = require('http-status');

// const { categoryService } = require('../services');
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const ApiError = require('../utils/ApiError');

/**
 * Query for product
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getProducts = async (filter, options) => {
  const product = await Product.paginate(filter, options);
  return product;
};

/**
 * Create a product
 * @param {Object} productBody
 * @returns {Promise<Product>}
 */
const createProduct = async (productBody) => {
  // if (!(await Category.isDuplicate(productBody.category))) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Thể loại chưa tồn tại');
  // }

  // if (await Product.isNameDuplicate(productBody.name)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Sản phẩm đã tồn tại');
  // }

  return Product.create(productBody);
};

/**
 * Get product by id
 * @param {ObjectId} id
 * @returns {Promise<Product>}
 */
const getProductById = async (id) => {
  return Product.findById(id);
};

/**
 * Get product by slug
 * @param {String} slug
 * @returns {Promise<Product>}
 */
const getProductBySlug = async (slug) => {
  const product = await Product.findOneAndUpdate(
    { slug },
    {
      $inc: {
        viewCount: 1,
      },
    }
  );

  return product;
};


const getRelatedProducts = async(slug) => {

  console.log("slug")
  const {category = null} = await Product.findOne({slug})

  const productRelateds = await Product.find({category}).sort("-createdAt").limit(4).lean()
  return productRelateds 
}

/**
 * Update product by id
 * @param {ObjectId} productId
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
const updateProductById = async (productId, updateBody) => {
  const product = await getProductById(productId);

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sản phẩm không tồn tại');
  }

  if (updateBody.name && (await Product.isNameDuplicate(updateBody.name))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Tên sản phẩm đã tồn tại');
  }

  Object.assign(product, updateBody);
  await product.save();
  return product;
};

/**
 * Delete product by id
 * @param {ObjectId} productId
 * @returns {Promise<Product>}
 */
const deleteProductById = async (productId) => {
  const product = await getProductById(productId);

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sản phẩm không tồn tại');
  }
  await product.remove();
  return product;
};

// Query proudct hot, new, best seller
const queryClassification = async () => {
  const result = await Promise.all([
    Product.find().sort({ viewCount: -1 }).limit(8).lean(),
    Product.find().sort({ viewCount: -1 }).limit(8).lean(),
    Product.find().sort({ createdAt: -1 }).limit(8).lean(),
  ]);

  
  return {hots: result[0], bestSellers: result[1], news: result[2]};
};

// Query random product
const queryRandom = async () => {
  const result = await Product.aggregate([{ $sample: { size: 4 } }])
  return result;
};


const searchProduct = async(text, filter, options) => {
  let sort = "";

  if(options?.sortBy){
    let [field , con] = options?.sortBy.split(':');

    if(con == "asc"){
      sort = `${field}`
    }else {
      sort = `-${field}`

    }
  }  
  return Product.find({ $or: [{ $text: { $search: text } }, { name: { $regex: new RegExp(text, 'gi') } }] })
    .sort(sort)
    .limit(5)
    .lean();
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
  getProductBySlug,
  queryClassification,
  queryRandom,
  getRelatedProducts,
  searchProduct
};
