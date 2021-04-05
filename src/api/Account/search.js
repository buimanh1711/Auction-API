const search = (req, res) => {
  const afterFilter = req.afterFilter || []
  const { slug } = req.params
  const query = slug.split('-')

  const lib = afterFilter.map(item => ({
    words: item.slug.split('-'),
    data: {
      ...item._doc
    }
  }))

  const result = lib.map(item => {
    const weight = item.words.reduce((time, word) => {
      query.forEach(item2 => {
        if (item2 === word)
          time++
      })
      return time
    }, 0)

    if (weight > 0) {
      return {
        ...item.data,
        weight
      }
    }
  }).filter(x => x).sort((a, b) => b.weight - a.weight)
  
  res.json({
    status: true,
    posts: result
  })
}

module.exports = search