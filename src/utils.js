'use strict'

const join = require('path').join
const exists = require('fs').existsSync
const errors = require('feathers-errors')

function getServiceName (req) {
  return req.params.service || req.body.service
}

function missingServiceName () {
  return new Error('Missing service name')
}

function checkToken (app, req) {
  const secret = app.get('dump-db-secret')
  return req.headers['dump-db-secret'] === secret
}

function wrongToken () {
  return new errors.NotAuthenticated('Missing token')
}

function getDbPath (app, serviceName) {
  const nedb = app.get('nedb')
  if (!nedb) {
    throw new Error('Missing NeDB setting')
  }

  const dbPath = join(nedb, `${serviceName}.db`)
  if (!exists(dbPath)) {
    throw new Error('Missing db file ' + dbPath)
  }
  return dbPath
}

module.exports = {
  getServiceName: getServiceName,
  missingServiceName: missingServiceName,
  checkToken: checkToken,
  wrongToken: wrongToken,
  getDbPath: getDbPath
}
