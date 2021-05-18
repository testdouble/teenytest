# teenytest

[![Build Status](https://travis-ci.org/testdouble/teenytest.svg?branch=main)](https://travis-ci.org/testdouble/teenytest)

A test runner so tiny, you have to squint to see it!

If you put test scripts in `test/lib`, then teenytest's CLI will run them with
zero public-API and zero configuration. That's pretty teeny, by the sound of it!

## Usage

```
npm i --save-dev teenytest
```

## Using the CLI

teenytest includes a CLI, which can be run ad hoc with:

```
$(npm bin)/teenytest
```

By default, the CLI will assume your tests are in `"test/lib/**/*.js"` and it
will search for a test helper in `"test/helper.js"`. You can specify either or
both of these by providing arguments, as well:

```
$(npm bin)/teenytest "test/lib/**/*.js" --helper "test/helper.js"
```

### As an npm script

We prefer including our script in the `scripts` section of our package.json:

``` json
"scripts": {
  "test": "teenytest test/lib/**/*.test.js --helper test/helper.js"
}
```

With that configuration above, you could run all your tests with:

```
npm test
```

If you want to run a single test, you can just tack an additional path or glob
at the end without looking at how teenytest is configured in the package.json:

```
npm test path/to/my.test.js
```

The above will ignore the glob embedded in the npm script and only run
`path/to/my.test.js`.

## Writing tests

### Test styles

Our tests are just Node.js modules. Rather than specify your tests via a fancy
testing API, whatever your test modules sets onto `module.exports` will determine
how teenytest will run the test. Modules can export either a single test
function or an object of (potentially nested) test functions.

Read on for examples.

#### Single function tests

If you export a function, that function will be run as a single test. Note
that you'll get better test output if you name the function.

``` javascript
var assert = require('assert')

module.exports = function blueIsRed(){
  assert.equal('blue', 'red')
}
```

The above test will fail (since `'blue'` doesn't equal `'red'`) with output like:

```
TAP version 13
1..1
not ok 1 - "blueIsRed" - test #1 in `test/lib/single-function.js`
  ---
  AssertionError: 'blue' == 'red'
    at blueIsRed (teenytest/example/simple-node/test/lib/single-function.js:4:10)
    at teenytest/index.js:47:9
    ...
    at Module._compile (module.js:434:26)
  ...
```

#### Exporting an object of test functions

If you export an object, you can include as many tests as you like. You can also
implement any or all of the four supported test hooks: `beforeEach`, `afterEach`,
`beforeAll`, and `afterAll`.

A file with two tests and all the hooks implemented could look like:

``` javascript
var assert = require('assert')

module.exports = {
  beforeAll: function() { console.log("I'll run once before both tests") },
  beforeEach: function() { console.log("I'll run twice - once before each test") },

  adds: function() { assert.equal(1 + 1, 2) },
  subtracts: function() { assert.equal(4 - 2, 2) },

  afterEach: function() { console.log("I'll run twice - once after each test") },
  afterAll: function() { console.log("I'll run once after both tests") }
}
```

This will output what you might expect (be warned: using `console.log` in your
actual tests will make teenytest's output unparseable by TAP reporters):

```
TAP version 13
1..2
I'll run once before both tests
I'll run twice - once before each test
ok 1 - "adds" - test #1 in `test/lib/exporting-an-object.js`
I'll run twice - once after each test
I'll run twice - once before each test
ok 2 - "subtracts" - test #2 in `test/lib/exporting-an-object.js`
I'll run twice - once after each test
I'll run once after both tests
```

#### Nested tests

Nested tests are also supported, in which any object can contain any combination
of hooks, test functions, and additional sub-test objects. This makes nested
teenytest modules very similar to what's possible with "BDD"-like test libraries
(in what are traditionally referred to as "example groups" by RSpec, Jasmine,
and Mocha parlance).

A common rationale for writing nested tests is to define one nested set of tests
for each public method on a subject, for better symmetry between the test and the
subject.

Let's see an [example](example/simple-node/test/lib/dog-test.js). Given this test in
`test/lib/dog-test.js`:

``` js
var assert = require('assert')
var Dog = require('../../lib/dog')

module.exports = {
  beforeEach: function () {
    this.subject = new Dog('Sam')
  },
  bark: {
    once: function () {
      assert.deepEqual(this.subject.bark(1), ['Woof #0'])
    },
    twice: function () {
      assert.deepEqual(this.subject.bark(2), ['Woof #0', 'Woof #1'])
    }
  },
  tag: {
    frontSaysName: function () {
      assert.equal(this.subject.tag('front'), 'Hi, I am Sam')
    },
    backSaysAddress: function () {
      assert.equal(this.subject.tag('back'), 'And here is my address')
    }
  }
}
```

You'll get this output upon running `$ teenytest test/lib/dog-test.js`:

```
TAP version 13
1..4
ok 1 - "bark once" - test #1 in `example/simple-node/test/lib/dog-test.js`
ok 2 - "bark twice" - test #2 in `example/simple-node/test/lib/dog-test.js`
ok 3 - "tag frontSaysName" - test #3 in `example/simple-node/test/lib/dog-test.js`
ok 4 - "tag backSaysAddress" - test #4 in `example/simple-node/test/lib/dog-test.js`
```

### Assertions

One thing you'll notice right away is that teenytest does not ship with its own
assertion library. In teenytest, any test that throws an error will trigger a
test failure. To keep things simple, the examples in teenytest use Node's
built-in [assert module](https://nodejs.org/api/assert.html), but keep in mind
that it isn't intended for public consumption.

If you like the simplicity of the built-in assert, you might want to use its port
[core-assert](https://github.com/sindresorhus/core-assert).
[chai](https://github.com/chaijs/chai) is also a very popular choice.

### Writing asynchronous tests

#### With callbacks

Any test hook or test function can also support asynchronous behavior via a
callback function. To indicate that a function is asynchronous, add a callback
argument to the test method.

For instance, a synchronous test could:

``` js
module.exports = function() {
  require('assert').equal(1+1, 2)
}
```

But an asynchronous test could specify a `done` argument and tell teenytest that
the test (or hook) is complete by invoking `done()`.

``` js
module.exports = function(done) {
  process.nextTick(function(){
    require('assert').equal(1+1, 2)
    done()
  })
}
```

A test failure can be triggered by either throwing an uncaught exception (which
teenytest will be listening for during each asynchronous step) or by passing an
`Error` as the first argument to `done`.

#### With promises

If you would prefer to return a promise to manage asynchronous tests, take a look
at the [teenytest-promise](https://github.com/testdouble/teenytest-promise)
plugin.

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
`beforeEach`/`afterEach` hooks, meanwhile will run before and after each test
in the entire suite.

## Advanced CLI Usage

### Configuration

You can configure teenytest via CLI arguments or as properties of a `teenytest`
object in your `package.json`. A full example follows:

```
$(npm bin)/teenytest \
  --helper test/support/helper.js \
  --timeout 3000 \
  --configurator config/teenytest.js \
  --plugin test/support/benchmark-plugin.js \
  --plugin teenytest-promise \\
  "lib/**/*.test.js"
```

The above is equivalent to the following `package.json` entry:

``` json
"teenytest": {
  "testLocator": "lib/**/*.test.js",
  "helper": "test/support/helper.js",
  "asyncTimeout": 3000,
  "configurator": "config/teenytest.js",
  "plugins": [
    "test/support/benchmark-plugin.js",
    "teenytest-promise"
  ]
}
```

These options are available:

* **testLocator** - [Default: `"test/lib/**/*.js"`] - one or more globs which
teenytest should use to search for tests. May be a string or an array of strings
* **name** - [Default: `[]`] - one or more global name filters to be applied
to all files matched by `testLocator`
* **helper** - [Default: `"test/helper.js"`] - the location of your global test
helper file
* **asyncTimeout** - [Default: `5000`] - the maximum timeout (in milliseconds) for any
given test in your suite
* **configurator** - [Default: `undefined`] - a `require`-able path which exports
a function that with parameters `(teenytest, cb)`. Configurator files may be used
to run custom code just before the test runner executes the test suite, register
or unregister plugins with functions provided by `teenytest.plugins`, and must
invoke the provided callback
* **plugins** - [Default: `[]`] - an array of `require`-able paths which export
either teenytest plugin objects or no-arg functions that return plugin objects

### Specifying which test files to run

If you'd like to run tests from specific files, you can do that by passing
`testLocator` as an unnamed option on the command line.

```
teenytest test/foo-test.js
```

Multiple path/glob options can be passed for `testLocator`. The following will
run all tests in `test/specific-foo-test.js` as well as any test file matching
the glob pattern `test/*-bar-test.js`.

```
teenytest test/single-foo-test.js test/*-bar-test.js
```

### Filtering which tests are run

If you'd like to just run one test from a file, you can do that, too!

#### Locating by name

If you have a test in `test/foo-test.js` and it exports an object with functions
`bar` and `baz`, you could tell teenytest to just run `baz` with:

```
teenytest test/foo-test.js#baz
```

The `#` character will split the glob on the left from the name on the right.

This can even be used across multiple tests in a wildcard glob, allowing you to
slice a CI build based on a particular concern, for instance, you could run all
audit log tests across your project's modules so long as they name the test
the same thing (e.g. `teenytest test/**/*.js#audit`) to run all of them at once,
without necessarily having to split that concern into its own set of
files or directories.

#### Locating by line number

Suppose you have a test in `test/bar-test.js` and you want to run the test on
line 14 (whether that's the line number where the function is declared, or just
some line inside the exported test function). You can run just that test with:

```
teenytest test/bar-test.js:14
```

#### Locating with multiple names or line numbers

Each `testLocator` option can include one name or line number filter suffix.
The same glob may be passed multiple times with different suffixes to locate
tests matching more than one filter:

```
teenytest \
  test/foo-test.js#red \
  test/foo-test.js#blue \
  test/bar-test.js:14 \
  test/bar-test.js:28
```

The above will run tests named `red` and `blue` in the file `test/foo-test.js`
and tests on lines 14 and 28 in the file `test/bar-test.js`.

#### Locating with the `--name` option

The `--name` option may be used to specify a global name filter that will be
applied to every `testLocator` in addition to any filter suffixes provided. The
following two commands would result in identical test runs:

```
teenytest \
  --name=red
  test/foo.test.js
  test/bar.test.js#blue
  test/baz.test.js:14
```

```
teenytest \
  test/foo.test.js
  test/foo.test.js#red
  test/bar.test.js#blue
  test/bar.test.js#red
  test/baz.test.js:14
  test/baz.test.js#red
```

`--name` may be used multiple times to specify more than one global name
filter:

```
teenytest --name=red --name=blue test/foo.test.js
```

### Setting a timeout

By default, teenytest will allow 5 seconds for tests with asynchronous hooks or
test functions to run before failing the test with a timeout error. To change
this setting, set the `--timeout` flag in milliseconds:

```
teenytest --timeout 10000
```

The above will set the timeout to 10 seconds.

## Reporting

teenytest's output is
[TAP13](https://testanything.org/tap-version-13-specification.html)-compliant,
so its output can be reported on and aggregated with numerous supported
continuous integration & reporting tools.

### Coverage with istanbul

If you're looking for code coverage, we recommend using
[istanbul](https://github.com/gotwarlost/istanbul)'s CLI. To get started,
install istanbul locally:

```
npm i --save-dev istanbul
```

Suppose you're currently running your teeny tests with:

```
$(npm bin)/teenytest "lib/**/*.test.js" --helper "test/unit-helper.js"
```

You can now generate a coverage report for the same test run with:

```
$(npm bin)/istanbul cover node_modules/teenytest/bin/teenytest -- "lib/**/*.test.js" --helper "test/unit-helper.js"
```

Note the use of `--` before the arguments intended for teenytest itself, which
istanbul will forward along.

You could also set up both as [npm scripts](https://docs.npmjs.com/misc/scripts)
so you could run either `npm test` and `npm run test:cover` by specifying them
in your package.json:

``` json
"scripts": {
  "test": "teenytest \"lib/**/*.test.js\" --helper test/unit-helper.js",
  "test:cover": "istanbul cover teenytest -- \"lib/**/*.test.js\" --helper test/unit-helper.js"
}
```

## Other good stuff

### Building teenytest plugins

Most of the runtime behavior in teenytest is implemented as plugins that
wrap the functions, tests, and suites defined by the user. You can register
your own plugin like this:

``` js
teenytest.plugins.register({
  name: 'pending',
  interceptors: {
    test: function (runTest, metadata, cb) {
      runTest(function pendingTest(er, results) {
        if (_.startsWith(metadata.name, 'pending') && results.passing) {
          metadata.triggerFailure(new Error('Pending should not pass!'))
        }
        cb(er)
      })
    }
  }
})
```

The above plugin will fail any tests whose name starts with "pending" but that
actually passed. There are several types of plugins, but all of them follow the
same theme of wrapping the users' own defined functions and (often nested)
suites.

There are two things to keep in mind when designing a plugin: wrapper scopes and
lifecycle events.

#### Plugin wrapper scopes

There are three scopes of specificity each plugin can attach to: `userFunction`,
`test`, and `suite`.

##### userFunction wrappers

A `userFunction` could be a hook like `beforeAll` or `afterEach` or an actual
test function. If your plugin should augment or observe the actual behavior of
the functions a user defines in their test listings, then you want to define a
userFunction plugin.

For example, a plugin below might be a starting point for adding promise support
to teenytest:

``` js
module.exports = {
  name: 'teenytest-promise',
  translators: {
    userFunction: function (runUserFunction, metadata, cb) {
      runUserFunction(function (er, result) {
        if (typeof result.value === 'object' &&
            typeof result.value['then'] === 'function') {
          result.value.then(
            function promiseFulfilled (value) {
              cb(er, value)
            },
            function promiseRejected (reason) {
              cb(reason, null)
            }
          )
        } else {
          cb(er)
        }
      })
    }
  }
}
```

(The above is also the actual source listing of v1.0.0 of the
[teenytest-promise](https://github.com/testdouble/teenytest-promise) module.)

###### test wrappers

Not to be confused with a test _function_, a `test` wrapper scope encompasses a
test function _plus_ all its hooks. If your plugin is concerned with each test's
results, you probably want a `test`-scoped wrapper.

An example is teenytest's built-in timeout plugin, which guards against tests
that take too long:

``` js
var timeoutInMs = 1000
teenytest.plugins.register({
  name: 'teenytest-timeout',
  supervisors: {
    test: function (runTest, metadata, cb) {
      var timedOut = false
      var timer = setTimeout(function outtaTime () {
        timedOut = true
        cb(new Error('Test timed out! (timeout: ' + timeoutInMs + 'ms)'))
      }, timeoutInMs)

      runTest(function timerWrappedCallback (er) {
        if (!timedOut) {
          clearTimeout(timer)
          cb(er)
        }
      })
    }
  }
})
```

##### suite wrappers

Finally, plugins can also wrap the execution of entire suites of tests using the
`suite` scope. This scope is most often necessary when your plugin wants to
comprehend the overall test suite as a tree, and wants to visit each of the
suites as nodes on the tree.

This is certainly the least-used scoping, and is most likely to be needed by
plugins that gather test results or report on them.

#### Plugin lifecycle events

The example above defines its wrapper under `interceptors`, because it needs to
run after results have been initially determined but before the results have been
logged to the console. Below are the available events to hook into:

##### translators

Wrapper functions defined under a plugin's `translators` property will run first,
which should enable the author to augment the behavior of the test itself. For
instance, one of the first plugins teenytest runs converts all of the user's
functions to a consistent async callback API, regardless of whether the user
function was asynchronous or not.

##### supervisors

Wrapper functions that desire to short-circuit or affect the failure/passing
status of a test are implemented under a plugin's `supervisors` key. Two examples
built into teenytest of this are a plugin that enforces a timeout for each test
and another that catches uncaught exceptions (i.e. if the user throws error
instead of passing it to the callback function).

##### analyzers

Wrapper functions that compute results are defined under the `analyzers` key of
a plugin. Teenytest ships with a built-in results plugin & store that is probably
fine for most purposes, but if you want to determine the results of your tests
some other way, you would define your own `analyzers` wrappers.

It's important to note that prior to the `analyzers` lifecycle event, all
callbacks pass any test failure as an initial error argument, but—because
the built-in results plugin can ensure recorded results are passed to subsequent
plugin wrappers' callbacks—any errors up to this point will be swallowed and
replaced with `null`. If a subsequent plugin wrapper passes an error to its own
callback function, it will be interpreted by teenytest as a fatal error, aborting
the test run.

##### interceptors

Sometimes a plugin that plays a supervisory role actually requires knowledge of
a test's results in order to determine if a failure occurred. A classic example
of this (and perhaps the only use case) are things like "pending test" features,
where tests flagged as works-in-progress or "pending" should fail (because
they've been marked by the user as unfinished). As a result, a pending test
interceptor might trigger a failure for any pending test that passes (perhaps
indicating to the user they need to write a failing test or unflag the test as
no longer pending).

##### reporters

Reporter wrappers come after all the other plugins, using the provided
results callback to write results. By default, teenytest writes out TAP13 to
standard out, but a custom reporter could format results any way it likes.

### Invoking teenytest via the API

While it'd be unusual to need it, if you `require('teenytest')`, its exported
function looks like:

> teenytest(globOfTestPaths, [options], callback)

The function takes a glob pattern describing where your tests are located and
an options object with a few simple settings. If your tests pass, the callback's
second argument will be `true`. If your tests fail, it will be `false`.

Here's an example test script with every option set and a comment on the
defaults:

``` javascript
#!/usr/bin/env node

var teenytest = require('teenytest')

teenytest('test/lib/**/*.js', {
  helperPath: 'test/helper.js', // module that exports test hook functions (default: null)
  output: console.log, // output for writing results
  cwd: process.cwd(), // base path for test globs & helper path,
  asyncTimeout: 5000 // milliseconds to wait before triggering failure of async tests & hooks
}, function(er, passing) {
  process.exit(!er && passing ? 0 : 1)
})
```

As you can see, the above script will bail with a non-zero exit code if the tests
don't pass or if a fatal error occurs.

While the API is asynchronous, but both synchronous and asynchronous tests are
supported.

