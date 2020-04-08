const mongoose = require('mongoose')

const fields = {
  version: { type: String, default: '0.0.0' },
  adapterStatus: { String, default: '' },
  name: { type: String, default: '' },
  ota: { type: Boolean, defalut: false },
  tunnel: { type: Boolean, defalut: false },
  rpiUpdate: { type: Boolean, defalut: false },
  linuxVer: { type: String, default: '' },
  statusWlan0: { type: String, default: '' },
  statusWlan1: { type: String, default: '' },
  reboot: { type: Boolean, defalut: false },
  cycle: { type: Number, default: 60 },
  serialNo: { type: String, default: '' },
  targetURL: { type: String, default: '' },
  wifiSSID: { type: String, default: '' },
  wifiPassword: { type: String, default: '' },
  active: { type: Boolean, default: false }
}

const options = {
  timestamps: true
}

const schema = new mongoose.Schema(fields, options)
const Scanner = mongoose.model('Scanner', schema)

module.exports = Scanner
