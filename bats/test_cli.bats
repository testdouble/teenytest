#!/usr/bin/env bats

load helper

DESCRIBE="teenytest"

setup() {
	echo "set up"
}

teardown() {
	echo "tear down"
}

@test "with a single glob argument ${DESCRIBE} prints appropriate TAP ouput" {
  expected='TAP version 13
1..0
# Test run passed!
#   Passed: 0
#   Failed: 0
#   Total:  0'

  run ./bin/teenytest './nothing/here/*'

  [ "$output" = "$expected" ]
}

@test "with a single glob argument ${DESCRIBE} runs all tests in matching files" {
  expected='TAP version 13
1..3
ok 1 - test #1 in `./bats/fixtures/test_functions/basic-test-passing-function.js`
ok 2 - "bar" - test #1 in `./bats/fixtures/test_objects/basic-test-passing-object.js`
ok 3 - "baz" - test #2 in `./bats/fixtures/test_objects/basic-test-passing-object.js`
# Test run passed!
#   Passed: 3
#   Failed: 0
#   Total:  3'

  run ./bin/teenytest './bats/fixtures/test_*/*.js'

  [ "$output" = "$expected" ]
}

@test "with multiple glob arguments ${DESCRIBE} runs all tests in matching files" {
  expected='TAP version 13
1..3
ok 1 - test #1 in `./bats/fixtures/test_functions/basic-test-passing-function.js`
ok 2 - "bar" - test #1 in `./bats/fixtures/test_objects/basic-test-passing-object.js`
ok 3 - "baz" - test #2 in `./bats/fixtures/test_objects/basic-test-passing-object.js`
# Test run passed!
#   Passed: 3
#   Failed: 0
#   Total:  3'

  run ./bin/teenytest \
      './bats/fixtures/test_functions/basic-test-passing-function.js' \
      './bats/fixtures/test_objects/basic-test-passing-object.js'

  [ "$output" = "$expected" ]
}

@test "with multiple glob arguments resulting in duplicate test runs ${DESCRIBE} runs tests only once" {
  expected='TAP version 13
1..3
ok 1 - test #1 in `./bats/fixtures/test_functions/basic-test-passing-function.js`
ok 2 - "bar" - test #1 in `./bats/fixtures/test_objects/basic-test-passing-object.js`
ok 3 - "baz" - test #2 in `./bats/fixtures/test_objects/basic-test-passing-object.js`
# Test run passed!
#   Passed: 3
#   Failed: 0
#   Total:  3'

  run ./bin/teenytest \
      './bats/fixtures/test_*/*.js' \
      './bats/fixtures/test_functions/basic-test-passing-function.js' \
      './bats/fixtures/test_functions/basic-test-passing-function.js' \
      './bats/fixtures/test_objects/basic-test-passing-object.js' \
      './bats/fixtures/test_objects/basic-test-passing-object.js'

  [ "$output" = "$expected" ]
}

@test "with glob arguments following '--' ${DESCRIBE} runs all tests in matching files" {
  expected='TAP version 13
1..3
ok 1 - test #1 in `./bats/fixtures/test_functions/basic-test-passing-function.js`
ok 2 - "bar" - test #1 in `./bats/fixtures/test_objects/basic-test-passing-object.js`
ok 3 - "baz" - test #2 in `./bats/fixtures/test_objects/basic-test-passing-object.js`
# Test run passed!
#   Passed: 3
#   Failed: 0
#   Total:  3'

  run ./bin/teenytest -- \
      './bats/fixtures/test_functions/basic-test-passing-function.js' \
      './bats/fixtures/test_objects/basic-test-passing-object.js'

  [ "$output" = "$expected" ]
}

@test "with '#' filter suffix ${DESCRIBE} runs all tests in matching files with matching name filters" {
  expected='TAP version 13
1..4
ok 1 - "named_test_aaa" - test #1 in `./bats/fixtures/filterable-examples-same-as-other-file.js`
ok 2 - "group_a group_b named_test_aaa" - test #2 in `./bats/fixtures/filterable-examples-same-as-other-file.js`
ok 3 - "named_test_aaa" - test #1 in `./bats/fixtures/filterable-examples.js`
ok 4 - "group_a group_b named_test_aaa" - test #2 in `./bats/fixtures/filterable-examples.js`
# Test run passed!
#   Passed: 4
#   Failed: 0
#   Total:  4'

  run ./bin/teenytest './bats/fixtures/filterable-examples*.js#named_test_aaa'

  [ "$output" = "$expected" ]
}

@test "with per-argument '#' filter suffix ${DESCRIBE} runs all tests with matching name filters only for the file being filtered" {
  expected='TAP version 13
1..4
ok 1 - "named_test_aaa" - test #1 in `./bats/fixtures/filterable-examples.js`
ok 2 - "group_a group_b named_test_aaa" - test #2 in `./bats/fixtures/filterable-examples.js`
ok 3 - "named_test_bbb" - test #1 in `./bats/fixtures/filterable-examples-same-as-other-file.js`
ok 4 - "group_a group_b named_test_bbb" - test #2 in `./bats/fixtures/filterable-examples-same-as-other-file.js`
# Test run passed!
#   Passed: 4
#   Failed: 0
#   Total:  4'

  run ./bin/teenytest \
      './bats/fixtures/filterable-examples.js#named_test_aaa' \
      './bats/fixtures/filterable-examples-same-as-other-file.js#named_test_bbb'

  [ "$output" = "$expected" ]
}

@test "with per-argument '#' filters resulting in different matches ${DESCRIBE} within the same file runs all matching tests for the file" {
  expected='TAP version 13
1..4
ok 1 - "named_test_aaa" - test #1 in `./bats/fixtures/filterable-examples.js`
ok 2 - "group_a group_b named_test_aaa" - test #2 in `./bats/fixtures/filterable-examples.js`
ok 1 - "named_test_bbb" - test #3 in `./bats/fixtures/filterable-examples.js`
ok 2 - "group_a group_b named_test_bbb" - test #4 in `./bats/fixtures/filterable-examples.js`
# Test run passed!
#   Passed: 4
#   Failed: 0
#   Total:  4'

  run ./bin/teenytest \
      './bats/fixtures/filterable-examples.js#named_test_aaa' \
      './bats/fixtures/filterable-examples.js#named_test_bbb'

  [ "$output" = "$expected" ]
}

@test "with per-argument '#' filters resulting in duplicate matches ${DESCRIBE} runs all matching tests only once removing duplicates" {
  expected='TAP version 13
1..4
ok 1 - "named_test_aaa" - test #1 in `./bats/fixtures/filterable-examples.js`
ok 2 - "group_a group_b named_test_aaa" - test #2 in `./bats/fixtures/filterable-examples.js`
ok 3 - "named_test_bbb" - test #1 in `./bats/fixtures/filterable-examples-same-as-other-file.js`
ok 4 - "group_a group_b named_test_bbb" - test #2 in `./bats/fixtures/filterable-examples-same-as-other-file.js`
# Test run passed!
#   Passed: 4
#   Failed: 0
#   Total:  4'

  run ./bin/teenytest \
      './bats/fixtures/filterable-*.js#named_test_aaa' \
      './bats/fixtures/filterable-examples.js#named_test_aaa' \
      './bats/fixtures/filterable-examples-same-as-other-file.js#named_test_aaa' \
      './bats/fixtures/filterable-examples-same-as-other-file.js#named_test_bbb'

  [ "$output" = "$expected" ]
}
