# Example

To test out teenytest's CLI, just run `npm install` from the directory above this
one, then change back into this directory and run:

```
$ ../bin/teenytest
```

And teenytest will load the helper in `test/helper.js` and the tests in
`test/lib`.

You should see some output like this:

```
TAP version 13
1..3
I run absolutely first
I'll run once before both tests
I run before each test
I'll run twice before each test
ok 1 - "adds" - test #1 in `test/lib/exporting-an-object.js`
I run right after each test
I'll run twice after each test
I run before each test
I'll run twice before each test
ok 2 - "subtracts" - test #2 in `test/lib/exporting-an-object.js`
I run right after each test
I'll run twice after each test
I'll run once after both tests
I run before each test
not ok 3 - "blueIsRed" - test #1 in `test/lib/single-function.js`
  ---
  message: 'blue' == 'red'
  stacktrace: AssertionError: 'blue' == 'red'
    at blueIsRed (/Users/justin/code/testdouble/teenytest/example/test/lib/single-function.js:4:10)
    at /Users/justin/code/testdouble/teenytest/index.js:47:9
    at arrayEach (/Users/justin/code/testdouble/teenytest/node_modules/lodash/lodash.js:473:11)
    at Function.forEach (/Users/justin/code/testdouble/teenytest/node_modules/lodash/lodash.js:7607:11)
    at /Users/justin/code/testdouble/teenytest/index.js:43:7
    at arrayEach (/Users/justin/code/testdouble/teenytest/node_modules/lodash/lodash.js:473:11)
    at Function.forEach (/Users/justin/code/testdouble/teenytest/node_modules/lodash/lodash.js:7607:11)
    at module.exports (/Users/justin/code/testdouble/teenytest/index.js:41:5)
    at Object.<anonymous> (/Users/justin/code/testdouble/teenytest/bin/teenytest:7:15)
    at Module._compile (module.js:434:26)
  ...
I run right after each test
I run absolutely last
```
