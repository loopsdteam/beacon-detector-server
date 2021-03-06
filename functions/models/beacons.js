const mongoose = require('mongoose')

const fields = {
  name: { type: String, default: 'unknown' },
  address: { type: String, default: '00:00:00:00:00:00', index: true, unique: true },
  uuid: { type: String, default: '' },
  startTime: { type: Date },
  endTime: { type: Date },
  count: { type: Number, default: 0 },
  rssi: { type: Number, default: 0 },
  txPower: { type: Number, default: 0 },
  major: { type: Number, default: 0 },
  minor: { type: Number, default: 0 },
  _scannerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scanner', index: true },
  group: { type: String, default: '' }
}

const options = {
  timestamps: true
}

const schema = new mongoose.Schema(fields, options)
const Beacon = mongoose.model('Beacon', schema)

module.exports = Beacon
