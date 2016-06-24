var assert = require('assert')
var teenytest = require('../index')

module.exports = {
  registeringIdenticalPluginMovesItToTheBack: function (cb) {
    teenytest.plugins.register(somePlugin)
    teenytest.plugins.register(otherPlugin)
    assert.deepEqual(teenytest.plugins.list(), ['some-plugin', 'other-plugin'])
    teenytest.plugins.register(somePlugin)
    assert.deepEqual(teenytest.plugins.list(), ['other-plugin', 'some-plugin'])
    cb(null)
  },
  registeringSameNameDifferentPluginThrowsError: function (cb) {
    teenytest.plugins.register(somePlugin)
    try {
      teenytest.plugins.register(someOtherPlugin)
      return cb(new Error('expected an error to be thrown'))
    } catch (e) {
      assert.equal(e.message, 'A different plugin named "some-plugin" is ' +
                              'already registered. First unregister it with ' +
                              '`teenytest.plugins.unregister("some-plugin"))`.')
      return cb(null)
    }
  },
  registeringNamelessPlugin: function (cb) {
    try {
      teenytest.plugins.register({})
      return cb(new Error('expected an error to be thrown'))
    } catch (e) {
      assert.equal(e.message, 'Plugins are required to have a "name" attribute.')
      return cb(null)
    }
  }
}

var somePlugin = {
  name: 'some-plugin',
  translators: {
    userFunction: function (runUserFunction, metadata, cb) {
      runUserFunction(cb)
    }
  }
}

var otherPlugin = {
  name: 'other-plugin'
}

var someOtherPlugin = {
  name: 'some-plugin'
}

