const ProductModel = require('../../models/product')

const getProduct = (productId, userInfo, price) => {
  return ProductModel.updateOne({
    _id: productId
  }, {
    winner: userInfo._id,
    sold: true,
    price: price
  })
}

module.exports = getProduct