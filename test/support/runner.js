#!/usr/bin/env node

var glob = require('glob')
var path = require('path')
var _ = require('lodash')
var async = require('async')
var teenytest = require('../../index')

var globLocator = process.argv[2] || 'test/*.js'
var passing = false

async.series(_.map(glob.sync(globLocator), function (file) {
  return function (cb) {
    teenytest.plugins.unregisterAll()
    console.log('Running test in "' + file + '"')
    require(path.resolve(process.cwd(), file))(cb)
  }
}), function (er) {
  if (er) { throw er }
  console.log('Looks good!')
  passing = true
})

process.on('exit', function () {
  if (!passing) {
    console.error('You fail!')
    process.exit(1)
  }
})

