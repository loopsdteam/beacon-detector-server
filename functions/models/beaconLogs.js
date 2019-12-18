const mongoose = require('mongoose')

const fields = {
  address: { type: String, default: '00:00:00:00:00:00', index: true },
  uuid: { type: String, default: '' },
  startTime: { type: Date },
  endTime: { type: Date },
  count: { type: Number, default: 0 },
  rssi: { type: Number, default: 0 },
  txPower: { type: Number, default: 0 },
  major: { type: Number, default: 0 },
  minor: { type: Number, default: 0 },
  _scannerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scanner', index: true },
  _beaconId: { type: mongoose.Schema.Types.ObjectId, ref: 'Beacon', index: true },
  name: { type: String, default: '', index: true }
}

const options = {
  timestamps: true
}

const schema = new mongoose.Schema(fields, options)

schema.index({ createdAt: -1, address: 1 })
schema.index({ startTime: 1, _beaconId: 1 })
const BeaconLog = mongoose.model('BeaconLog', schema)

module.exports = BeaconLog
