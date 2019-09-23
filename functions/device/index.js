const app = require('express')()
const cors = require('cors')
const admin = require('firebase-admin')
require('express-async-errors')
const mdb = require('../lib/db')
const Scanner = require('../models/scanners')
const Beacon = require('../models/beacons')
const BeaconLog = require('../models/beaconLogs')

mdb.connect(() => {
  console.log('callback')
})
const db = admin.database()
const refBeacons = db.ref('device').child('beacons')

app.use(cors({ origin: true }))

app.post('/', async (req, res) => {
  const data = req.body
  if (data.scanner._id === '') delete data.scanner._id
  if (!data.scanner) return res.status(400).end()
  let result = { scanner: {} }
  if (!data.scanner._id) {
    result.scanner = await Scanner.create({ version: data.scanner.version, ota: true })
  } else {
    result.scanner = await Scanner.findByIdAndUpdate({ _id: data.scanner._id }, { $set: data.scanner }, { new: true })
      .catch(e => { return null })
    if (!result.scanner) result.scanner = await Scanner.create({ version: data.scanner.version, ota: true })
  }
  if (result.scanner && result.scanner.ota) await Scanner.updateOne({ _id: result.scanner._id }, { $set: { ota: false } })
  if (!data.beacons || !data.beacons.length) return res.send(result)

  for (const v of data.beacons) {
    v._scannerId = result.scanner._id
    const f = { address: v.address }
    const o = { upsert: true, new: true, setDefaultsOnInsert: true }
    const r = await Beacon.findOneAndUpdate(f, { $set: v }, o)
    v.name = r.name
    v._beaconId = r._id
    await BeaconLog.create(v)
  }
  const bs = await Beacon.find().populate({ path: '_scannerId', select: 'name' }).limit(10).lean()
  bs.forEach(v => {
    v._id = v._id.toString()
    // v._scannerId = v._scannerId
    v.createdAt = new Date(v.createdAt).toISOString()
    v.updatedAt = new Date(v.updatedAt).toISOString()
    v.startTime = new Date(v.startTime).toISOString()
    v.endTime = new Date(v.endTime).toISOString()
  })
  refBeacons.set(bs)

  res.send(result)
})

app.use(require('../middlewares/verifyToken'))

app.use((req, res, next) => {
  if (req.claims.level === undefined) return res.status(403).send({ message: 'not authorized' })
  if (req.claims.level > 1) return res.status(403).send({ message: 'not authorized' })
  next()
})

app.get('/beacons', async (req, res) => {
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

  result.totalCount = await Beacon.countDocuments()
    .where('address').regex(search)

  result.items = await Beacon.find()
    .where('address').regex(search)
    .sort(s)
    .skip(offset)
    .limit(limit)
    .populate({ path: '_scannerId', select: 'name' })

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
  if (limit < 0) limit = 0
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
    .populate({ path: '_scannerId', select: 'name' })
    // .populate({ path: '_beaconId', select: 'name' })

  res.send(result)
})

app.use((req, res, next) => {
  if (req.claims.level > 0) return res.status(403).send({ message: 'not authorized' })
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
  res.status(204).end()
})

app.delete('/scanner/:_id', async (req, res) => {
  // await db.collection('devices').doc(req.params.id).set(req.body)
  await Scanner.deleteOne({ _id: req.params._id })
  res.status(204).end()
})

app.get('/scanners/search', async (req, res) => {
  const items = await Scanner.find().where('name').regex(req.query.search).limit(2)
  res.send(items)
})

app.patch('/beacon/:_id', async (req, res) => {
  if (!req.body.name) return res.status(400).end()
  await Beacon.updateOne({ _id: req.params._id }, { $set: { name: req.body.name } })
  res.status(204).end()
})

app.delete('/beacon/:_id', async (req, res) => {
  await Beacon.deleteOne({ _id: req.params._id })
  res.status(204).end()
})

app.use(require('../middlewares/error'))

module.exports = app
