#!/usr/bin/env node

var glob = require('glob')
var path = require('path')

var files = glob.sync('test/*.js')

files.forEach(function(file){
  console.log('Running test in "'+file+'"')
  require(path.resolve(process.cwd(), file))
})
