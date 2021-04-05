const deleteProduct = (req, res, next) => {
  const { userInfo } = req
  const { authorId } = req.body
  const { productId } = req.params

  if (userInfo._id === authorId) {
      PostModel.deleteOne({
          _id: productId
      })
          .then(resData => {
              if (resData) {
                  res.json({
                      status: true
                  })
              } else {
                  req.err = 'khong the xoa'
                  next('last')
              }
          })
  }
}

module.exports = deleteProduct