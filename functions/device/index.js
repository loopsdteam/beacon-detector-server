const app = require('express')()
const cors = require('cors')
// const admin = require('firebase-admin')
require('express-async-errors')
const db = require('../lib/db')
const Device = require('../models/devices')
const Beacon = require('../models/beacons')

db.connect(() => {
  console.log('callback')
})

// const db = admin.firestore()

app.use(cors({ origin: true }))

app.post('/', async (req, res) => {
  const data = req.body
  if (!data.device) return res.status(400).end()
  let result = { device: {} }
  if (!data.device._id) {
    result.device = await Device.create({ version: data.device.version, ota: true })
  } else {
    result.device = await Device.findByIdAndUpdate(data.device._id, { $set: data.device }, { new: true })
  }
  if (!data.beacons || !data.beacons.length) return res.send(result)
  data.beacons.forEach((v) => {
    v._deviceId = result.device._id
  })
  try {
    await Beacon.insertMany(data.beacons)
  } catch (e) {}

  res.send(result)
})

app.get('/detectors', async (req, res) => {
  let { offset, limit, order, sort, search } = req.query
  offset = Number(offset)
  limit = Number(limit)
  sort = Number(sort)
  if (!search) search = ''
  const result = {
    items: [],
    totalCount: 0
  }
  const s = {}
  s[order] = sort

  result.totalCount = await Device.countDocuments()
    .where('name').regex(search)

  result.items = await Device.find()
    .where('name').regex(search)
    .sort(s)
    .skip(offset)
    .limit(limit)

  res.send(result)
})

app.put('/detector/:_id', async (req, res) => {
  // await db.collection('devices').doc(req.params.id).set(req.body)
  await Device.updateOne({ _id: req.params._id }, { $set: req.body })
  res.status(200).end()
})

app.get('/beacons', async (req, res) => {
  let { offset, limit, order, sort, search } = req.query
  offset = Number(offset)
  limit = Number(limit)
  sort = Number(sort)
  if (!search) search = ''
  const result = {
    items: [],
    totalCount: 0
  }
  const s = {}
  s[order] = sort

  result.totalCount = await Beacon.countDocuments()
    .where('address').regex(search)

  result.items = await Beacon.find()
    .where('address').regex(search)
    .sort(s)
    .skip(offset)
    .limit(limit)

  res.send(result)
})

// app.post('/', async (req, res) => {
//   const data = req.body
//   if (!data.device) return res.status(400).end()
//   let id = data.device.id
//   if (!id) {
//     if (id !== undefined) delete data.device.id // for empty string
//     const s = await db.collection('devices').add(data.device)
//     id = s.id
//   }
//   const s = await db.collection('devices').doc(id).get()
//   const sd = s.data()
//   sd.id = id
//   const u = { updatedAt: new Date() }
//   if (sd.ota) u.ota = false
//   await db.collection('devices').doc(id).update(u)
//   res.send(sd)
// })

// app.post('/beacons', async (req, res) => {
//   const data = req.body
//   if (!data.device || !data.device.id || !data.beacons) return res.status(400).end()

//   const batch = db.batch()
//   const id = data.device.id

//   data.beacons.forEach(v => {
//     v.deviceId = id
//     v.updatedAt = new Date()
//     batch.set(db.collection('beacons').doc(v.address), v)
//   })

//   await batch.commit()

//   res.status(200).end()
// })

app.use(require('../middlewares/error'))

module.exports = app
