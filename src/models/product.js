const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Product = new Schema({
  name: { type: String, maxLength: 255 },
  image: { type: String, default: '/images/default_img.png'},
  minPrice: { type: Number, default: 1},
  quickPrice: { type: Number, default: 1},
  content: { type: String, maxLength: 600, default: '' },
  time: { type: Date },
  createDate: { type: Date, default: Date.now },
  seller: { type: String, ref: 'account' },
  category: { type: String, ref: 'category' },
  producer: { type: String, ref: 'producer'},
  winner: { type: String, ref: 'account'},
  playingList: { type: Array, default: []},
  sold: { type: Boolean, default: false},
  slug: { type: String, maxLength: 255 },
  passed: { type: Boolean, default: false }
})

module.exports = mongoose.model('product', Product)