const ProductModel = require('../../models/product')
const CategoryModel = require('../../models/category')
const toSlug = require('../../utils/toSlug')
const getPage = require('../../utils/getPage')
const jwt = require('jsonwebtoken')
const fs = require('fs')

const create = (req, res, next) => {
  const data = req.body || {}
  
  const { _path, categoryId, userInfo } = req
  const newProduct = {
      name: data.name,
      content: data.content,
      image: _path,
      time: data.time,
      minPrice: data.minPrice,
      quickPrice: data.quickPrice,
      priceStep: data.priceStep,
      producer: data.producer,
      seller: userInfo._id,
      slug: data.slug,
      category: categoryId,
  }

  ProductModel.findOne({ slug: newProduct.slug })
      .then(product => {
          if (product) {
              req.err = 'Post existed'
              return next('last')
          } else {
              const newProductIns = new ProductModel(newProduct)

              newProductIns.save(err => {
                  if (err !== null) {
                      console.log(err)
                      req.err = 'can not save product'
                      return next('last')
                  } else {
                      res.json({
                          status: true,
                          message: 'tao post tahnhcong'
                      })
                  }
              })
          }
      })

}

module.exports = create