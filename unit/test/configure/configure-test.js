var subject = require('../../../lib/configure')

module.exports = {
  'builds test file criteria with no filters from a single path': function () {
    const config = subject(['../safe/fixtures/single-func.js'], {})
    var expected = [{
      file: '../safe/fixtures/single-func.js'
    }]
    assert.deepEqual(config.criteria.testFiles, expected)
  },

  'builds test file criteria with no filters from an array of paths': function () {
    const config = subject([
      '../safe/fixtures/single-func.js',
      '../safe/fixtures/single-named-func.js'
    ], {})
    var expected = [
      { file: '../safe/fixtures/single-func.js' },
      { file: '../safe/fixtures/single-named-func.js' }
    ]
    assert.deepEqual(config.criteria.testFiles, expected)
  },

  'builds test file criteria with no filters from a single glob pattern': function () {
    const config = subject('../safe/fixtures/single-func.js', {})
    var expected = [{
      file: '../safe/fixtures/single-func.js'
    }]
    assert.deepEqual(config.criteria.testFiles, expected)
  },

  'builds test file criteria with no filters from an array of glob patterns': function () {
    const config = subject([
      '../safe/fixtures/nested-*.js',
      '../safe/fixtures/single-*.js'
    ], {})
    var expected = [
      { file: '../safe/fixtures/nested-sparse-test.js' },
      { file: '../safe/fixtures/nested-test.js' },
      { file: '../safe/fixtures/single-func.js' },
      { file: '../safe/fixtures/single-named-func.js' }
    ]
    assert.deepEqual(config.criteria.testFiles, expected)
  },

  'builds test file criteria without duplicates from an array of glob patterns and paths': function () {
    const config = subject([
      '../safe/fixtures/nested-*.js',
      '../safe/fixtures/single-*.js',
      '../safe/fixtures/nested-test.js',
      '../safe/fixtures/single-func.js'
    ], {})
    var expected = [
      { file: '../safe/fixtures/nested-sparse-test.js' },
      { file: '../safe/fixtures/nested-test.js' },
      { file: '../safe/fixtures/single-func.js' },
      { file: '../safe/fixtures/single-named-func.js' }
    ]
    assert.deepEqual(config.criteria.testFiles, expected)
  },

  'builds line number criteria from globs with ":" filter suffix': function () {
    const config = subject([
      '../safe/fixtures/basic-test-passing-object.js:2',
      '../safe/fixtures/basic-test-passing-object.js:3',
      '../safe/fixtures/fail-function.js:5'
    ], {})
    var expected = [
      {
        file: '../safe/fixtures/basic-test-passing-object.js',
        lineNumber: ['2', '3']
      },
      {
        file: '../safe/fixtures/fail-function.js',
        lineNumber: ['5']
      }
    ]
    assert.deepEqual(config.criteria.testFiles, expected)
  },

  'builds test name criteria from globs with "#" filter suffix': function () {
    const config = subject([
      '../safe/fixtures/basic-test-passing-object.js#bar',
      '../safe/fixtures/basic-test-passing-object.js#baz',
      '../safe/fixtures/context-test.js#test1'
    ], {})
    var expected = [
      {
        file: '../safe/fixtures/basic-test-passing-object.js',
        name: ['bar', 'baz']
      },
      {
        file: '../safe/fixtures/context-test.js',
        name: ['test1']
      }
    ]
    assert.deepEqual(config.criteria.testFiles, expected)
  },

  'builds test name filter criteria from a file and example option': function () {
    const config = subject('../safe/fixtures/basic-test-passing-object.js', { example: 'exampleName' })
    var expected = [{
      file: '../safe/fixtures/basic-test-passing-object.js',
      name: ['exampleName']
    }]
    assert.deepEqual(config.criteria.testFiles, expected)
  },

  'builds test name filter criteria from a file and multiple example options': function () {
    const config = subject('../safe/fixtures/basic-test-passing-object.js', { example: ['exampleName', 'otherExample'] })
    var expected = [{
      file: '../safe/fixtures/basic-test-passing-object.js',
      name: ['exampleName', 'otherExample']
    }]
    assert.deepEqual(config.criteria.testFiles, expected)
  }
}
