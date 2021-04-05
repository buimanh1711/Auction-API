const AccountModel = require('../../models/account')

const getAll = (req, res, next) => {
  AccountModel.find({})
    .then(data => {
      if (data && data.length > 0) {
        req.afterFilter = data
        next()
      }
    })
    .catch(err => {
      return res.send(err)
    })
}

module.exports = getALl