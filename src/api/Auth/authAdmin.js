const checkAdmin = (req, res, next) => {
  const { userRole } = req
  console.log(userRole)

  if(userRole === 'admin') {
    res.json({
      status: true
    })
  } else {
    req.err = 'not permiss'
    next('last')
  }
}

module.exports = checkAdmin