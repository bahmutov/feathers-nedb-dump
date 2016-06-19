'use strict'

const write = require('fs').writeFileSync
const utils = require('./utils')

module.exports = function dbSetInit (app) {
  return function dbSet (req, res, next) {
    const serviceName = utils.getServiceName(req)
    if (!serviceName) {
      return next(utils.missingServiceName())
    }
    const newDB = req.body.db
    if (!newDB) {
      return next(new Error('Missing new db'))
    }

    const service = app.service(serviceName)
    if (!service) {
      return next(new Error('Cannot find service ' + serviceName))
    }

    if (!utils.checkToken(app, req)) {
      return next(utils.wrongToken())
    }

    const dbPath = utils.getDbPath(app, serviceName)

    console.log('setting db for service', serviceName)
    if (typeof service.Model.loadDatabase !== 'function') {
      return next(new Error('Cannot find loadDatabase'))
    }

    write(dbPath, req.body.db, 'utf8')
    service.Model.loadDatabase(function (err) {
      if (err) {
        return next(err)
      }
      console.log('replaced %s with new contents', dbPath)
      res.status(200).end()
    })
  }
}
