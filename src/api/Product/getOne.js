const ProductModel = require('../../models/product')

const getOne = (req, res, next) => {
  const slug = req.params.slug
  ProductModel.findOne({ slug })
      .populate('category')
      .populate('author', 'firstName lastName _id image role')
      .then(resData => {
          if (resData) {
              res.json({
                  status: true,
                  post: resData
              })
          } else {
              req.err = 'khong tim thay bai viet'
              next('last')
          }
      })
}

module.exports = getOne