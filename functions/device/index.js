const app = require('express')()
const cors = require('cors')
// const admin = require('firebase-admin')
require('express-async-errors')
const db = require('../lib/db')
const Scanner = require('../models/scanners')
const Beacon = require('../models/beacons')
const BeaconLog = require('../models/beaconLogs')

db.connect(() => {
  console.log('callback')
})

// const db = admin.firestore()

app.use(cors({ origin: true }))

app.post('/', async (req, res) => {
  const data = req.body
  if (!data.scanner) return res.status(400).end()
  let result = { scanner: {} }
  if (!data.scanner._id) {
    result.scanner = await Scanner.create({ version: data.scanner.version, ota: true })
  } else {
    result.scanner = await Scanner.findByIdAndUpdate(data.scanner._id, { $set: data.scanner }, { new: true })
  }
  if (!data.beacons || !data.beacons.length) return res.send(result)
  data.beacons.forEach((v) => {
    v._scannerId = result.scanner._id
  })
  try {
    await Beacon.insertMany(data.beacons)
  } catch (e) {}
  try {
    await BeaconLog.insertMany(data.beacons)
  } catch (e) {}

  res.send(result)
})

app.get('/scanners', async (req, res) => {
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

  result.totalCount = await Scanner.countDocuments()
    .where('name').regex(search)

  result.items = await Scanner.find()
    .where('name').regex(search)
    .sort(s)
    .skip(offset)
    .limit(limit)

  res.send(result)
})

app.put('/scanner/:_id', async (req, res) => {
  // await db.collection('devices').doc(req.params.id).set(req.body)
  await Scanner.updateOne({ _id: req.params._id }, { $set: req.body })
  res.status(200).end()
})

app.get('/scanners/search', async (req, res) => {
  const items = await Scanner.find().where('name').regex(req.query.search).limit(2)
  res.send(items)
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

app.get('/beacons/search', async (req, res) => {
  const items = await Beacon.find().where('address').regex(req.query.search).limit(2)
  res.send(items)
})

app.get('/beacon-logs', async (req, res) => {
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

  result.totalCount = await BeaconLog.countDocuments()
    .where('address').regex(search)

  result.items = await BeaconLog.find()
    .where('address').regex(search)
    .sort(s)
    .skip(offset)
    .limit(limit)

  res.send(result)
})

app.get('/beacon-logs/search', async (req, res) => {
  const items = await Beacon.find().where('address').regex(req.query.search).limit(2)
  res.send(items)
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
