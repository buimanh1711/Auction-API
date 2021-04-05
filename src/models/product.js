const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Product = new Schema({
  name: { type: String, maxLength: 255 },
  image: { type: String, default: '/images/default_img.png'},
  minPrice: { type: Number, default: 0},
  quickPrice: { type: Number, default: 0},
  description: { type: String, maxLength: 600 },
  limitTime: { type: Date },
  createDate: { type: Date, default: Date.now },
  seller: { type: String, ref: 'account' },
  category: { type: String, ref: 'category' },
  trademark: { type: String, ref: 'trademark'},
  winner: { type: String, ref: 'account'},
  playingList: { type: Array, default: []},
  sold: { type: Boolean, default: false},
  slug: { type: String, maxLength: 255 },
  passed: { type: Boolean, default: false }
})

module.exports = mongoose.model('product', Product)