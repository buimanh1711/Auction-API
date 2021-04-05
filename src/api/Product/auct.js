const ProductModel = require('../../models/product')

const auct = (data) => {

  // const { productId } = req.params
  console.log('testing socket')
  socket.emit('reply client', {name: 'manh', age: 18})
}

module.exports = auct