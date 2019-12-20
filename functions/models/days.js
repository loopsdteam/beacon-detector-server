const mongoose = require('mongoose')

const fields = {
  _beaconId: { type: mongoose.Schema.Types.ObjectId, ref: 'Beacon' },
  address: { type: String, index: true },
  count: { type: Number, default: 0 },
  createdAt: { type: Date, required: true, index: true },
  _scannerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scanner', index: true }
}

const options = {
  timestamps: {
    createdAt: false,
    updatedAt: true
  }
}

const schema = new mongoose.Schema(fields, options)

schema.index({ createdAt: -1, _beaconId: 1, _scannerId: 1 }, { unique: true })

const Day = mongoose.model('Day', schema)

module.exports = Day
