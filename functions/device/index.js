const app = require('express')()
const cors = require('cors')
require('express-async-errors')
const db = require('../lib/db')
const Scanner = require('../models/scanners')
const Beacon = require('../models/beacons')
const BeaconLog = require('../models/beaconLogs')

db.connect(() => {
  console.log('callback')
})

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
  data.beacons.forEach(async (v) => {
    v._scannerId = result.scanner._id
    const f = { address: v.address }
    const o = { upsert: true, new: true, setDefaultsOnInsert: true }
    await Beacon.findOneAndUpdate(f, { $set: v }, o)
  })
  // try {
  //   await Beacon.insertMany(data.beacons)
  // } catch (e) {}
  try {
    await BeaconLog.insertMany(data.beacons)
  } catch (e) {}

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

app.use((req, res, next) => {
  if (req.claims.level > 0) return res.status(403).send({ message: 'not authorized' })
  next()
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

app.use(require('../middlewares/error'))

module.exports = app
