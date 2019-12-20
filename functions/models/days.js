const mongoose = require('mongoose')

const fields = {
  beacon: { type: mongoose.Schema.Types.ObjectId, ref: 'Beacon' },
  count: { type: Number, default: 0 },
  createdAt: { type: Date, required: true }
}

const options = {
  timestamps: {
    createdAt: false,
    updatedAt: true
  }
}

const schema = new mongoose.Schema(fields, options)

schema.index({ createdAt: -1, beacon: 1 })

const Day = mongoose.model('Day', schema)

module.exports = Day
