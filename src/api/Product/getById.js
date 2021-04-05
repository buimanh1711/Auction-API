const ProductModel = require('../../models/product')
const CategoryModel = require('../../models/category')

getById = (req, res, next) => {
  const { productId } = req.params
  const { userInfo } = req

  ProductModel.findOne({ _id: productId })
      .populate('category')
      .populate('author', 'firstName lastName _id image role')
      .then(resData => {
          if (resData) {
              if (userInfo._id == resData.author._id) {
                  res.json({
                      status: true,
                      post: resData
                  })
              } else {
                  req.err = 'not permissed'
                  next('last')
              }

          } else {
              req.err = 'khong tim thay bai viet'
              next('last')
          }
      })
}

module.exports = getById