const app = require('express')()
const cors = require('cors')
const admin = require('firebase-admin')
require('express-async-errors')
const mdb = require('../lib/db')
const Scanner = require('../models/scanners')
const Beacon = require('../models/beacons')
const BeaconLog = require('../models/beaconLogs')
const moment = require('moment')

mdb.connect(() => {
  // console.log('callback')
})

const db = admin.firestore()

app.use(cors({ origin: true }))

app.post('/rfid', async (req, res) => {
  const data = req.body

  const rfid = data.rfid
  const scanner = data.scanner
  if (!rfid) return res.status(400).send('rfid required')
  if (!scanner) return res.status(400).send('scanner required')

  const { _id, version } = scanner
  const { id, time } = rfid

  const increment = admin.firestore.FieldValue.increment(1)

  await db.collection('rfids').doc(id).update({ time: moment(time).toDate(), scanner: _id, count: increment })
  await db.collection('rfidLogs').add({ id, time: moment(time).toDate() })

  return res.end('success')
})

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

    if (v.address === '58:7a:62:02:9b:4f' || v.address === '30:45:11:f0:c2:5b') {
      try {
        await db.collection('beaconLogs').add({
          scanner: data.scanner._id,
          address: v.address,
          createdAt: new Date()
        })
        const increment = admin.firestore.FieldValue.increment(1)
        await db.collection('beacons').doc(v.address)
          .update({ time: new Date(), scanner: data.scanner._id, count: increment })
      } catch (err) {
        return res.status(500).send({ message: err.message })
      }
    }
  }

  res.send(result)
})

app.use(require('../middlewares/verifyToken'))

app.use((req, res, next) => {
  if (req.claims.level === undefined) return res.status(403).send({ message: 'not authorized' })
  if (req.claims.level > 1) return res.status(403).send({ message: 'not authorized' })
  next()
})

app.get('/beacons', async (req, res) => {
  let { offset, limit, order, sort, search, group, _scannerId } = req.query
  offset = Number(offset)
  limit = Number(limit)
  if (limit < 0) limit = 0
  sort = Number(sort)
  if (!search) search = ''
  if (!group) group = ''
  if (!_scannerId) _scannerId = ''
  const result = {
    items: [],
    totalCount: 0
  }
  const s = {}
  s[order] = sort

  const countQuery = Beacon.countDocuments()
  const itemsQuery = Beacon.find()
  if (_scannerId) {
    countQuery.where('_scannerId').equals(_scannerId)
    itemsQuery.where('_scannerId').equals(_scannerId)
  }
  if (group) {
    countQuery.where('group').equals(group)
    itemsQuery.where('group').equals(group)
  }
  if (search) {
    countQuery.where('address').regex(search)
    itemsQuery.where('address').regex(search)
  }
  result.totalCount = await countQuery.exec()
  result.items = await itemsQuery
    .sort(s)
    .skip(offset)
    .limit(limit)
    .populate({ path: '_scannerId', select: 'name' })
    // .lean()
    .exec()
  // for (let v of result.items) {
  //   v.dayCount = await BeaconLog.countDocuments({ _beaconId: v._id, startTime: { $gte: moment(v.startTime).startOf('day').toDate() } })
  // }
  res.send(result)
})

app.get('/beacons/search', async (req, res) => {
  const items = await Beacon.find().where('address').regex(req.query.search).limit(2)
  res.send(items)
})

app.get('/beacon-logs/download', async (req, res) => {
  const moment = require('moment')

  let { search, date = moment().format('YYYY-MM-DD') } = req.query
  if (!search) search = ''

  const count = await BeaconLog.countDocuments()
    .where('address').regex(search)
    .where('createdAt')
    .gte(moment(date, 'YYYY-MM-DD').startOf('day').add(-9, 'hour').toDate())
    .lte(moment(date, 'YYYY-MM-DD').endOf('day').add(-9, 'hour').toDate())

  const rows = await BeaconLog.find()
    .where('address').regex(search)
    .where('createdAt')
    .gte(moment(date, 'YYYY-MM-DD').startOf('day').add(-9, 'hour').toDate())
    .lte(moment(date, 'YYYY-MM-DD').endOf('day').add(-9, 'hour').toDate())
    .populate({ path: '_scannerId', select: 'name' })
    .lean()

  rows.forEach((el, index, array) => {
    array[index].startTime = moment(el.startTime).add(9, 'hour').toDate()
    array[index].endTime = moment(el.endTime).add(9, 'hour').toDate()
  })

  const Json2csvParser = require('json2csv').Parser
  res.setHeader('Content-disposition', 'attachment; filename=' + 'Raw List.csv')
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  const options = {
    withBOM: true,
    fields: [
      { label: 'name', value: 'name' },
      { label: '_scannerId.name', value: '_scannerId.name' },
      { label: 'address', value: 'address' },
      { label: 'uuid', value: 'uuid' },
      { label: 'startTime', value: 'startTime' },
      { label: 'endTime', value: 'endTime' },
      { label: 'count', value: 'count' },
      { label: 'rssi', value: 'rssi' },
      { label: 'txPower', value: 'txPower' },
      { label: 'major', value: 'major' },
      { label: 'minor', value: 'minor' },
      { label: '_beaconId', value: '_beaconId' }
    ]
  }

  const parser = new Json2csvParser(options)
  const csv = parser.parse(rows)
  res.send(csv)
})

app.get('/beacon-logs', async (req, res) => {
  const moment = require('moment')

  let { offset, limit, order, sort, search, date = moment().format('YYYY-MM-DD'), _scannerId } = req.query
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

  // result.totalCount = await BeaconLog.countDocuments()
  //   .where('address').regex(search)
  //   .where('createdAt')
  //   .gte(moment(date, 'YYYY-MM-DD').startOf('day').add(-9, 'hour').toDate())
  //   .lte(moment(date, 'YYYY-MM-DD').endOf('day').add(-9, 'hour').toDate())

  // result.items = await BeaconLog.find()
  //   .where('address').regex(search)
  //   .where('createdAt')
  //   .gte(moment(date, 'YYYY-MM-DD').startOf('day').add(-9, 'hour').toDate())
  //   .lte(moment(date, 'YYYY-MM-DD').endOf('day').add(-9, 'hour').toDate())
  //   .sort(s)
  //   .skip(offset)
  //   .limit(limit)
  //   .populate({ path: '_scannerId', select: 'name' })
  //   // .populate({ path: '_beaconId', select: 'name' })

  const countQuery = BeaconLog.countDocuments()
  const itemsQuery = BeaconLog.find()
  if (_scannerId) {
    countQuery.where('_scannerId').equals(_scannerId)
    itemsQuery.where('_scannerId').equals(_scannerId)
  }
  if (search) {
    countQuery.where('address').regex(search)
    itemsQuery.where('address').regex(search)
  }
  result.totalCount = await countQuery
    .where('createdAt')
    .gte(moment(date, 'YYYY-MM-DD').startOf('day').add(-9, 'hour').toDate())
    .lte(moment(date, 'YYYY-MM-DD').endOf('day').add(-9, 'hour').toDate())
    .exec()
  result.items = await itemsQuery
    .where('createdAt')
    .gte(moment(date, 'YYYY-MM-DD').startOf('day').add(-9, 'hour').toDate())
    .lte(moment(date, 'YYYY-MM-DD').endOf('day').add(-9, 'hour').toDate())
    .sort(s)
    .skip(offset)
    .limit(limit)
    .populate({ path: '_scannerId', select: 'name' })
    .exec()

  res.send(result)
})

app.get('/beacon-log/:_beaconId/:date', async (req, res) => {
  const { _beaconId, date } = req.params
  const items = await BeaconLog
    .find()
    .where('_beaconId')
    .equals(_beaconId)
    .where('startTime')
    .gte(moment(date).startOf('day').add(-9, 'hour').toDate())
    .lte(moment(date).endOf('day').add(-9, 'hour').toDate())
    .select('-_id startTime endTime rssi count')
    .sort({ startTime: 1 })
    .limit(2880)
  res.send(items)
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

app.get('/scanners/search', async (req, res) => {
  const items = await Scanner.find().where('name').regex(req.query.search).limit(2)
  res.send(items)
})

app.get('/groups', async (req, res) => {
  const items = await Beacon.distinct('group').exists('group', true)
  res.send(items)
})

app.use((req, res, next) => {
  if (req.claims.level > 0) return res.status(403).send({ message: 'not authorized' })
  next()
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

app.patch('/beacon/:_id/name', async (req, res) => {
  if (!req.body.name) return res.status(400).end()
  await Beacon.updateOne({ _id: req.params._id }, { $set: { name: req.body.name } })
  res.status(204).end()
})

app.patch('/beacon/:_id/group', async (req, res) => {
  if (!req.body.group) return res.status(400).end()
  await Beacon.updateOne({ _id: req.params._id }, { $set: { group: req.body.group } })
  res.status(204).end()
})

app.delete('/beacon/:_id', async (req, res) => {
  await Beacon.deleteOne({ _id: req.params._id })
  res.status(204).end()
})

app.use(require('../middlewares/error'))

module.exports = app
