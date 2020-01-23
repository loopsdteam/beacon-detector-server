const app = require('express')()
const cors = require('cors')
// const admin = require('firebase-admin')
require('express-async-errors')
const mdb = require('../lib/db')
const Device = require('../models/devices')
// const moment = require('moment')

mdb.connect(() => {
  // console.log('callback')
})

// const db = admin.firestore()

app.use(cors({ origin: true }))

app.put('/scanner/:_id', async (req, res) => {
  const _id = req.params._id
  const body = req.body
  const version = body.version
  const beaconLength = body.beaconLength

  const device = await Device.findById(_id)

  if (!device) res.status(404).end(`Scanner ${_id} not found.`)
  else {
    device.set('version', version)
    device.set('beaconLength', beaconLength)
    await device.save()

    res.send(device)
  }
})

app.put('/scanner/:_id/ota', async (req, res) => {
  const _id = req.params._id
  const body = req.body
  const ota = body.ota || false

  const device = await Device.findById(_id)

  if (!device) res.status(404).end(`Scanner ${_id} not found.`)
  else {
    device.set('ota', ota)
    await device.save()
    res.send(device)
  }
})

app.put('/scanner/:_id/active', async (req, res) => {
  const _id = req.params._id
  const body = req.body
  const active = body.active

  const device = await Device.findById(_id)

  if (!device) res.status(404).end(`Scanner ${_id} not found.`)
  else {
    device.set('active', active)
    await device.save()
    res.send(device)
  }
})

app.post('/scanner/serial', async (req, res) => {
  const { serialNo, inspector } = req.body
  if (!serialNo) return res.status(404).end()
  if (!inspector) return res.status(404).end()
  const sc = await Device.findOne({ serialNo })
  if (sc) return res.send({ success: false, scanner: sc, message: '이미 등록된 제조일련번호입니다' })

  const r = await Device.create({ serialNo, inspector })
  res.send({ success: true, scanner: r })
})

app.use(require('../middlewares/error'))

module.exports = app
