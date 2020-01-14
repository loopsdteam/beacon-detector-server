const mongoose = require('mongoose')

const fields = {
  _scannerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scanner', index: true },
  beacons: { type: Number },
  diff: { type: Number }
}

const options = {
  timestamps: true
}

const schema = new mongoose.Schema(fields, options)

const Model = mongoose.model('ScannerLog', schema)

module.exports = Model
