#!/usr/bin/env node

var glob = require('glob')
var path = require('path')
var _ = require('lodash')
var async = require('async')

var store = require('../../lib/store')

var globLocator = process.argv[2] || 'safe/*.js'
var passing = false
var uncaughtErrors = []

async.series(_.map(glob.sync(globLocator), function (file) {
  var metaTest = require(path.resolve(process.cwd(), file))
  if (_.isFunction(metaTest)) {
    return function (cb) {
      store.reset()
      console.log('Running test in "' + file + '"')
      metaTest(cb)
    }
  } else {
    return function (cb) {
      async.eachSeries(_.toPairs(metaTest), function (entry, cb) {
        store.reset()
        console.log('Running test "' + entry[0] + '" in "' + file + '"')
        entry[1](cb)
      }, cb)
    }
  }
}), function (er) {
  if (er) { throw er }
  console.log('Looks good!')
  passing = true
})

process.on('uncaughtException', function (e) {
  uncaughtErrors.push(e)
})
process.on('exit', function () {
  if (!passing) {
    _.each(uncaughtErrors, function (e) {
      console.error('Uncaught error:')
      console.error(e.message)
      console.error(e.stack)
    })
    console.error('You fail!')
    process.exit(1)
  }
})

