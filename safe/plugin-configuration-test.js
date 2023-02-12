const async = require('async')
const spawn = require('child_process').spawn
const path = require('path')
const assert = require('core-assert')
const which = require('which')
const helper = require('./support/helper')

module.exports = function (cb) {
  async.parallel([
    vanillaTest,
    runWithPlugins('customize-plugins'),
    runWithPlugins('customize-configurator'),
    runWithPlugins('customize-cli')
  ], cb)
}

function vanillaTest (cb) {
  run('vanilla', function (er, code, log) {
    assert.equal(code, 0)

    helper.includes(log,
      'TAP version 13\n' +
      '1..2\n' +
      'ok 1 - "add" - test #1 in `test/simple-test.js`\n' +
      'ok 2 - "subtract" - test #2 in `test/simple-test.js`')

    cb(er)
  })
}

function runWithPlugins (name) {
  return function (cb) {
    run(name, function (er, code, log) {
      assert.equal(code, 0)

      helper.includes(log,
        'TAP version 13\n' +
        '1..2\n' +
        'About to run a before all\n' +
        'ok 1 - "add" - test #1 in `test/simple-test.js`\n' +
        'ok 2 - "subtract" - test #2 in `test/simple-test.js`\n' +
        'Sweet suite!')

      cb(er)
    })
  }
}

function run (projectDir, cb) {
  const options = {
    cwd: path.resolve(process.cwd(), 'safe/fixtures/projects/' + projectDir)
  }
  if (process.platform === 'win32') {
    const bashPath = which.sync('bash', { nothrow: true })
    if (bashPath) {
      options.shell = bashPath
    }
  }
  const test = spawn('npm', ['test'], options)

  let log = ''
  test.stdout.on('data', function (text) {
    log += text.toString()
  })
  test.stderr.on('data', function (text) {
    log += text.toString()
  })

  test.on('close', function (code) {
    cb(null, code, log)
  })
}
