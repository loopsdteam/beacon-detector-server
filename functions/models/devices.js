const mongoose = require('mongoose')

const fields = {
  version: { type: String, default: '0.0.0' },
  ota: { type: Boolean, defalut: true },
  cycle: { type: Number, default: 30 },
  serialNo: { type: String, default: '', unique: true },
  targetURL: { type: String, default: '' },
  active: { type: Boolean, default: false },
  inspector: { type: String, default: '' },
  mode: { type: String, default: 'BEACON', enum: ['BEACON', 'RFID', 'BOTH'] },
  beaconLength: { type: Number, default: 0 }
}

const options = {
  timestamps: true
}

const schema = new mongoose.Schema(fields, options)
const Device = mongoose.model('Device', schema)

module.exports = Device
