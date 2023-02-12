const assert = require('core-assert')
const teenytest = require('../index')
const store = require('../lib/store')

module.exports = {
  registeringIdenticalPluginMovesItToTheBack: function (cb) {
    store.initialize()

    teenytest.plugins.register(somePlugin)
    teenytest.plugins.register(otherPlugin)
    assert.deepEqual(teenytest.plugins.list(), ['some-plugin', 'other-plugin'])
    teenytest.plugins.register(somePlugin)
    assert.deepEqual(teenytest.plugins.list(), ['other-plugin', 'some-plugin'])
    cb(null)
  },
  registeringSameNameDifferentPluginThrowsError: function (cb) {
    store.initialize()

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
    store.initialize()

    try {
      teenytest.plugins.register({})
      return cb(new Error('expected an error to be thrown'))
    } catch (e) {
      assert.equal(e.message, 'Plugins are required to have a "name" attribute.')
      return cb(null)
    }
  }
}

const somePlugin = {
  name: 'some-plugin',
  translators: {
    userFunction: function (runUserFunction, metadata, cb) {
      runUserFunction(cb)
    }
  }
}

const otherPlugin = {
  name: 'other-plugin'
}

const someOtherPlugin = {
  name: 'some-plugin'
}
