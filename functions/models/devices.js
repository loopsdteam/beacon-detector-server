const mongoose = require('mongoose')

const fields = {
  serialNo: { type: String, default: '', unique: true },
  version: { type: String, default: '0.0.0' },
  inspector: { type: String, default: '' },
  active: { type: Boolean, default: false },
  ota: { type: Boolean, defalut: false },
  cycle: { type: Number, default: 30 },
  targetURL: { type: String, default: 'http://beacon.welltizen.kr/Api/Loop' },
  mode: { type: String, default: 'BEACON', enum: ['BEACON', 'RFID', 'BOTH'] },
  beaconLength: { type: Number, default: 0 },
  note: { type: String, default: '' }
}

const options = {
  timestamps: true
}

const schema = new mongoose.Schema(fields, options)
const Device = mongoose.model('Device', schema)

module.exports = Device
