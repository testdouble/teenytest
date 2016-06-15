# teenytest

[![Build Status](https://travis-ci.org/testdouble/teenytest.svg?branch=master)](https://travis-ci.org/testdouble/teenytest)

A test runner so tiny, you have to squint to see it!

If you put test scripts in `test/lib`, then teenytest's CLI will run them with
zero public-API and zero configuration. That's pretty teeny, by the sound of it!

## Usage

```
$ npm i --save-dev teenytest
```

## Using the CLI

teenytest includes a CLI, which can be run ad hoc with:

```
$ $(npm bin)/teenytest
```

By default, the CLI will assume your tests are in `"test/lib/**/*.js"` and it
will search for a test helper in `"test/helper.js"`. You can specify either or
both of these by providing arguments, as well:

```
$ $(npm bin)/teenytest "test/lib/**/*.js" --helper "test/helper.js"
```

### As an npm script

We prefer including our script in the `scripts` section of our package.json:

``` json
"scripts": {
  "test": "teenytest **/*.test.js --helper test/support/helper.js"
}
```

With that configuration above, you could run all your tests with:

```
$ npm test
```

If you want to run a single test, you can just tack an additional path or glob
at the end without looking at how teenytest is configured in the package.json:

```
$ npm test path/to/my.test.js
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
  message: 'blue' == 'red'
  stacktrace: AssertionError: 'blue' == 'red'
    at blueIsRed (teenytest/example/test/lib/single-function.js:4:10)
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
of hooks, test functions, and additional sub-tests objects. This makes nested
teenytest modules very similar to what's possible with "BDD"-like test libraries
(in what are traditionally referred to as "example groups" by RSpec, Jasmine,
and Mocha parlance).

A common rationale for writing nested tests is to define one nested set of tests
for each public method on a subject, for better symmetry between the test and the
subject.

Let's see an [example](example/test/lib/dog-test.js). Given this test in
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
ok 1 - "bark once" - test #1 in `example/test/lib/dog-test.js`
ok 2 - "bark twice" - test #2 in `example/test/lib/dog-test.js`
ok 3 - "tag frontSaysName" - test #3 in `example/test/lib/dog-test.js`
ok 4 - "tag backSaysAddress" - test #4 in `example/test/lib/dog-test.js`
```

### Writing asynchronous tests

Any test hook or test function can also support asynchronous behavior via a
callback function. To indicate that a function is asynchronous, add a function
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
  afterAll: function(){},
  options: {
    asyncTimeout: 5000
  }
}
```

In this case, the `beforeAll`/`afterAll` hooks will run only at the beginning
and the end of the entire suite (whereas the same hooks exported from a single
test file will run before or after all the tests in that same file).  The
`beforeEach`/`afterEach` hooks, meanwhile will run before and after each test
in the entire suite.

## Advanced CLI Usage

### Filtering which tests are run

If you'd like to just run one test from a file, you can do that, too!

#### Locating by name

If you have a test in `test/foo-test.js` and it exports an object with functions
`bar` and `baz`, you could tell teenytest to just run `baz` with:

```
$ teenytest test/foo-test.js#baz
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
$ teenytest test/bar-test.js:14
```

### Setting a timeout

By default, teenytest will allow 5 seconds for tests with asynchronous hooks or
test functions to run before failing the test with a timeout error. To change
this setting, set the `--timeout` flag in milliseconds:

```
$ teenytest --timeout 10000
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
$ npm i --save-dev istanbul
```

Suppose you're currently running your teeny tests with:

```
$ $(npm bin)/teenytest "lib/**/*.test.js" --helper "test/unit-helper.js"
```

You can now generate a coverage report for the same test run with:

```
$ $(npm bin)/istanbul cover node_modules/teenytest/bin/teenytest -- "lib/**/*.test.js" --helper "test/unit-helper.js"
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

While the API is asynchronous, but both sycnhronous and asynchronous tests are
supported.

