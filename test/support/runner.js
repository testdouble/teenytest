#!/usr/bin/env node

var glob = require('glob')
var path = require('path')
var _ = require('lodash')
var async = require('async')

var globLocator = process.argv[2] || 'test/*.js'

async.series(_.map(glob.sync(globLocator), function (file) {
  return function (cb) {
    console.log('Running test in "' + file + '"')
    require(path.resolve(process.cwd(), file))(cb)
  }
}), function (er) {
  if (er) { throw er }
  console.log('looks good!')
})
