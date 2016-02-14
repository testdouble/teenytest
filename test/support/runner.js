#!/usr/bin/env node

var glob = require('glob')
var path = require('path')
var _ = require('lodash')
var async = require('async')

async.series(_.map(glob.sync('test/*.js'), function (file) {
  return function (cb) {
    console.log('Running test in "' + file + '"')
    require(path.resolve(process.cwd(), file))(cb)
  }
}), function (er) {
  if (er) { throw er }
  console.log('looks good!')
})
