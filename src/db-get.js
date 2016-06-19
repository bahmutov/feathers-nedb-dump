'use strict'

const utils = require('./utils')

module.exports = function dbGetInit (app) {
  return function dbGet (req, res, next) {
    const serviceName = utils.getServiceName(req)
    if (!serviceName) {
      return next(utils.missingServiceName())
    }

    if (!utils.checkToken()) {
      return next(utils.wrongToken())
    }

    const dbPath = utils.getDbPath(app, serviceName)

    console.log('dumping DB', dbPath)
    return res.download(dbPath)
  }
}
