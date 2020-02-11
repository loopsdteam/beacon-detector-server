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

  const device = await Device.findById(_id)

  if (!device) res.status(404).end(`Scanner ${_id} not found.`)
  else {
    device.set('updatedAt', new Date())
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
  const { serialNo, inspector } = req.body
  if (!serialNo) return res.status(404).end()
  if (!inspector) return res.status(404).end()
  const sc = await Device.findOne({ serialNo })
  if (sc) return res.send({ success: false, scanner: sc, message: '이미 등록된 제조일련번호입니다' })

  const r = await Device.create({ serialNo, inspector })
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
