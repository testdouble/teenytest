# teenytest

A test runner so tiny, you have to squint to see it!

If you put test scripts in `test/lib`, then teenytest's CLI will run them with
zero public-API and zero configuration. That's pretty teeny, by the sound of it!

## Usage

```
$ npm i --save-dev teenytest
```

## via the CLI

teenytest includes a CLI, which can be run ad hoc with:

```
$ $(npm bin)/teenytest "test/lib/**/*.js"
```

But we prefer including it in the `scripts` section of your package.json:

``` json
"scripts": {
  "test": "teenytest 'test/lib/**/*.js'"
}
```

With that configuration, you can run your tests with:

```
$ npm test
```

If you don't provide a glob argument to the CLI, teeny will default to searching
for tests in `"test/lib/**/*.js"`


### via the API

If you `require('teenytest')`, its exported function looks like:

> teenytest(globOfTestPaths, [options])

The function takes a glob pattern describing where your tests are located and
an options object with a few simple settings. If your tests pass, it
returns `true`. If your tests fail, it returns `false`.

Here's an example test script with every option set and a comment on the
defaults:

``` javascript
#!/usr/bin/env node

var teenytest = require('teenytest')

var passing = teenytest('test/lib/**/*.js', {
  helperPath: 'test/helper.js', // module that exports test hook functions (default: null)
  output: console.log, // output for writing results (default: console.log)
  cwd: process.cwd() // base path for test globs & helper path (default: process.cwd())
})

process.exit(passing ? 0 : 42)
```

As you can see, the above script will bail with a non-zero exit code if the tests
don't pass.

For teenyness sake, the API is synchronous, meaning that asynchronous tests are
not supported. If that doesn't suit you, we recommend adopting a somewhat less
teeny test runner.

## Writing tests

Your tests can export either a test function or an object of test functions.

### Exporting a function

If you export a single function, that function will be run as a single test. Note
that you'll get better test output if you name the function.

``` javascript
var assert = require('assert')

module.exports = function blueIsRed(){
  assert.equal('blue', 'red')
}
```

### Exporting an object

If you export an object, you can include as many tests as you like. You can also
implement any or all of the four supported test hooks: `beforeEach`, `afterEach`,
`beforeAll`, and `afterAll`.

A file with two tests and all the hooks implemented could look like:

``` javascript
var assert = require('assert')

module.exports = {
  beforeAll: function() { console.log("I'll run once before both tests") }
  beforeEach: function() { console.log("I'll run twice before each test") }

  adds: function() { assert.equal(1 + 1, 2) }
  subtracts: function() { assert.equal(4 - 2, 2) }

  afterEach: function() { console.log("I'll run twice after each test") }
  afterAll: function() { console.log("I'll run once after both tests") }
}
```

Will output what you might expect (be warned: using `console.log` in your actual
tests will make teenytest's output unparseable by TAP reporters):

```
TAP version 13
1..2
I'll run once before both tests
I'll run twice before each test
ok 1 - "adds" - test #1 in `test/lib/exporting-an-object.js`
I'll run twice after each test
I'll run twice before each test
ok 2 - "subtracts" - test #2 in `test/lib/exporting-an-object.js`
I'll run twice after each test
I'll run once after both tests
```

## Test Helper & Global Hooks

In addition to defining before & after hooks on a per test file basis, teenytest
also supports a global test helper, which it will search for by default in
`test/helper.js`, but can be configured with the `helperPath` configuration
option in the API.

An example helper might look like this:

``` javascript
// make global things common across each test to save on per-test setup
global.assert = require('assert')

module.exports = {
  beforeAll: function(){},
  beforeEach: function(){},
  afterEach: function(){},
  afterAll: function(){}
}
```

In this case, the `beforeAll`/`afterAll` hooks will run only at the beginning
and the end of the entire suite (whereas the same hooks exported from a single
test file will run before or after all the tests in that same file).  The
`beforeEach`/`afterEach` hooks, meanwhile will run

## Reporting

teenytest's output is
[TAP13](https://testanything.org/tap-version-13-specification.html)-compliant,
so its output can be reported on and aggregated with numerous supported
continuous integration & reporting tools.


