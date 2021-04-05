const ProductModel = require('../../models/product')
const CategoryModel = require('../../models/category')

update = (req, res, next) => {
  const { userInfo } = req
  const data = req.body || {}
  const { _path, categoryId } = req
  const { productId } = req.params

  if (userInfo.id !== data.author._id) {
      req.err = 'not permissed'
      return next('last')
  }

  const newProduct = {
      title: data.title,
      description: data.shortDesc,
      content: data.content,
      image: _path || data.image,
      slug: data.slug,
      category: categoryId,
      source: data.source
  }

  ProductModel.updateOne(
      {
          _id: productId
      },
      newProduct
  )
      .then(resData => {
          if (resData) {
              if(data.oldFile && data.oldFile !== _path && data.oldFile !== 'default_image.png' && data.oldFile !== 'user_default.jpg') {
                  try {
                      console.log('thanh cong')
                      fs.unlinkSync(`${__dirname}../../../../public/upload/${data.oldFile}`)
                  } catch (err) {
                      console.log(err)
                  }
              }
              res.json({
                  status: true,
                  message: 'cap nhat thanh cong!'
              })
          } else {
              req.err = 'loi server'
              next('last')
          }

      })
      .catch(err => {
          req.err = 'cap nhat that bai'
          next('last')
      })
}

module.exports = update