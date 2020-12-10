const mongoose = require('mongoose')

const fields = {
  serialNo: { type: String, default: '', unique: true },
  version: { type: String, default: '0.0.0' },
  inspector: { type: String, default: '' },
  active: { type: Boolean, default: false },
  ota: { type: Boolean, default: false },
  tunnel: { type: Boolean, default: false },
  tunnelPort: { type: Number },
  tunnelTime: { type: Date },
  rpiUpdate: { type: Boolean, default: false },
  linuxVer: { type: String, default: '' },
  statusWlan0: { type: String, default: '' },
  statusWlan1: { type: String, default: '' },
  freqMax: { type: String, default: '' },
  freqMin: { type: String, default: '' },
  revision: { type: Number, default: 0 },
  wpaSupplicant: { type: String, default: '' },
  reboot: { type: Boolean, default: false },
  cycle: { type: Number, default: 30 },
  targetURL: { type: String, default: 'http://beacon.welltizen.kr/Api/Loop' },
  mode: { type: String, default: 'BEACON', enum: ['BEACON', 'RFID', 'BOTH'] },
  beaconLength: { type: Number, default: 0 },
  lastScanned: { type: Date },
  scannedLength: { type: Number },
  note: { type: String, default: '' },
  cpuSerial: { type: String }
}

const options = {
  timestamps: true
}

const schema = new mongoose.Schema(fields, options)
const Device = mongoose.model('Device', schema)

module.exports = Device
