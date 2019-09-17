const mongoose = require('mongoose')

const fields = {
  version: { type: String, default: '0.0.0' },
  name: { type: String, default: '' },
  ota: { type: Boolean, defalut: true },
  cycle: { type: Number, default: 60 }
}

const options = {
  timestamps: true
}

const schema = new mongoose.Schema(fields, options)
const Device = mongoose.model('Device', schema)

module.exports = Device
