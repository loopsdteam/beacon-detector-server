const app = require('express')()
const cors = require('cors')
// const admin = require('firebase-admin')
require('express-async-errors')
// const mdb = require('../lib/db')
const Device = require('../models/devices')

// mdb.connect(() => {
//   // console.log('callback')
// })

// const db = admin.firestore()

app.use(cors({ origin: true }))

app.put('/scanner/:_id', async (req, res) => {
  const _id = req.params._id
  const body = req.body
  const version = body.version
  const beaconLength = body.beaconLength
  const lastScanned = body.lastScanned
  const scannedLength = body.scannedLength
  const cpuSerial = body.cpuSerial
  const linuxVer = body.linuxVer
  const statusWlan0 = body.statusWlan0
  const statusWlan1 = body.statusWlan1

  const device = await Device.findById(_id)

  if (!device) res.status(404).end(`Scanner ${_id} not found.`)
  else {
    device.set('updatedAt', new Date())
    device.set('version', version)
    device.set('beaconLength', beaconLength)
    if (lastScanned) device.set('lastScanned', lastScanned)
    if (scannedLength) device.set('scannedLength', scannedLength)
    if (cpuSerial) device.set('cpuSerial', cpuSerial)
    if (linuxVer) device.set('linuxVer', linuxVer)
    if (statusWlan0) device.set('statusWlan0', statusWlan0)
    if (statusWlan1) device.set('statusWlan1', statusWlan1)
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

app.put('/scanner/:_id/tunnel', async (req, res) => {
  const _id = req.params._id
  const body = req.body
  const tunnel = body.tunnel || false
  const tunnelPort = body.tunnelPort || null
  const tunnelTime = body.tunnelTime || null

  const device = await Device.findById(_id)

  if (!device) res.status(404).end(`Scanner ${_id} not found.`)
  else {
    device.set('tunnel', tunnel)
    device.set('tunnelPort', tunnelPort)
    device.set('tunnelTime', tunnelTime)
    await device.save()
    res.send(device)
  }
})

app.put('/scanner/:_id/rpiupdate', async (req, res) => {
  const _id = req.params._id
  const body = req.body
  const rpiUpdate = body.rpiUpdate || false

  const device = await Device.findById(_id)

  if (!device) res.status(404).end(`Scanner ${_id} not found.`)
  else {
    device.set('rpiUpdate', rpiUpdate)
    await device.save()
    res.send(device)
  }
})

app.put('/scanner/:_id/reboot', async (req, res) => {
  const _id = req.params._id
  const body = req.body
  const reboot = body.reboot || false

  const device = await Device.findById(_id)

  if (!device) res.status(404).end(`Scanner ${_id} not found.`)
  else {
    device.set('reboot', reboot)
    await device.save()
    res.send(device)
  }
})

app.put('/scanner/:_id/active', async (req, res) => {
  const _id = req.params._id
  const body = req.body
  const active = body.active
  const version = body.version

  const device = await Device.findById(_id)

  if (!device) res.status(404).end(`Scanner ${_id} not found.`)
  else {
    device.set('active', active)
    if (version) device.set('version', version)
    await device.save()
    res.send(device)
  }
})

app.post('/scanner/serial', async (req, res) => {
  const { serialNo, inspector, targetURL } = req.body
  if (!serialNo) return res.status(404).end()
  if (!inspector) return res.status(404).end()
  if (!targetURL) return res.status(404).end()
  const sc = await Device.findOne({ serialNo })
  if (sc) {
    const r = await Device.findByIdAndUpdate(sc._id, { $set: { inspector, targetURL } }, { new: true })
    return res.send({ success: false, scanner: r, message: '이미 등록된 제조일련번호입니다' })
  }
  const r = await Device.create({ serialNo, inspector, targetURL })
  res.send({ success: true, scanner: r })
})

app.use(require('../middlewares/verifyToken'))

app.use((req, res, next) => {
  if (req.claims.level === undefined) return res.status(403).send({ message: 'not authorized' })
  if (req.claims.level > 1) return res.status(403).send({ message: 'not authorized' })
  next()
})

app.get('/scanners', async (req, res) => {
  let { offset, limit, order, sort, search } = req.query
  offset = Number(offset)
  limit = Number(limit)
  if (limit < 0) limit = 0
  sort = Number(sort)
  if (!search) search = ''
  const result = {
    items: [],
    totalCount: 0
  }
  const s = {}
  s[order] = sort

  result.totalCount = await Device.countDocuments()
    .where('serialNo').regex(search)

  result.items = await Device.find()
    .where('serialNo').regex(search)
    .sort(s)
    .skip(offset)
    .limit(limit)

  res.send(result)
})

app.get('/scanners/search', async (req, res) => {
  const items = await Device.find().where('serialNo').regex(req.query.search).limit(3)
  res.send(items)
})

app.get('/groups', async (req, res) => {
  const items = await Device.distinct('group').exists('group', true)
  res.send(items)
})

app.put('/scanner/:_id', async (req, res) => {
  // await db.collection('devices').doc(req.params.id).set(req.body)
  await Device.updateOne({ _id: req.params._id }, { $set: req.body })
  res.status(204).end()
})

app.patch('/scanner/:_id/ota', async (req, res) => {
  // await db.collection('devices').doc(req.params.id).set(req.body)
  console.log(req.body)
  await Device.updateOne({ _id: req.params._id }, { $set: { ota: req.body.ota } })
  res.status(204).end()
})

app.patch('/scanner/:_id/tunnel', async (req, res) => {
  // await db.collection('devices').doc(req.params.id).set(req.body)
  console.log(req.body)
  await Device.updateOne({ _id: req.params._id }, { $set: { tunnel: req.body.tunnel } })
  res.status(204).end()
})

app.patch('/scanner/:_id/rpiupdate', async (req, res) => {
  // await db.collection('devices').doc(req.params.id).set(req.body)
  console.log(req.body)
  await Device.updateOne({ _id: req.params._id }, { $set: { rpiUpdate: req.body.rpiUpdate } })
  res.status(204).end()
})

app.patch('/scanner/:_id/reboot', async (req, res) => {
  // await db.collection('devices').doc(req.params.id).set(req.body)
  console.log(req.body)
  await Device.updateOne({ _id: req.params._id }, { $set: { reboot: req.body.reboot } })
  res.status(204).end()
})

app.patch('/scanner/:_id/note', async (req, res) => {
  // await db.collection('devices').doc(req.params.id).set(req.body)
  await Device.updateOne({ _id: req.params._id }, { $set: { note: req.body.note } })
  res.status(204).end()
})

app.delete('/scanner/:_id', async (req, res) => {
  // await db.collection('devices').doc(req.params.id).set(req.body)
  await Device.deleteOne({ _id: req.params._id })
  res.status(204).end()
})

app.use(require('../middlewares/error'))

module.exports = app
