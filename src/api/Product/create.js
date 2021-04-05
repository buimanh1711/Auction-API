const ProductModel = require('../../models/product')
const CategoryModel = require('../../models/category')
const toSlug = require('../../utils/toSlug')
const getPage = require('../../utils/getPage')
const jwt = require('jsonwebtoken')
const fs = require('fs')

create = (req, res, next) => {
  const data = req.body || {}
  
  const { _path, categoryId, userInfo } = req
  const newProduct = {
      title: data.title,
      description: data.shortDesc,
      content: data.content,
      image: _path,
      author: userInfo._id,
      slug: data.slug,
      category: categoryId,
      source: data.source
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