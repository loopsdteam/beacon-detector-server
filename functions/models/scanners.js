const mongoose = require('mongoose')

const fields = {
  version: { type: String, default: '0.0.0' },
  name: { type: String, default: '' },
  ota: { type: Boolean, defalut: true },
  cycle: { type: Number, default: 60 },
  serialNo: { type: String, default: '' },
  targetURL: { type: String, default: '' }
}

const options = {
  timestamps: true
}

const schema = new mongoose.Schema(fields, options)
const Scanner = mongoose.model('Scanner', schema)

module.exports = Scanner
