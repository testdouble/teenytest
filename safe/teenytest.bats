#!/usr/bin/env bats

load test_helper

@test "with a single glob argument matching no files teenytest prints appropriate TAP ouput" {
  expected='TAP version 13
1..0
# Test run passed!
#   Passed: 0
#   Failed: 0
#   Total:  0'

  run ./bin/teenytest './nothing/here/*'

  [ "$output" = "$expected" ]
}

@test "with a single glob argument teenytest runs all tests in matching files" {
  expected='TAP version 13
1..3
ok 1 - test #1 in `./safe/fixtures/test_functions/basic-test-passing-function.js`
ok 2 - "bar" - test #1 in `./safe/fixtures/test_objects/basic-test-passing-object.js`
ok 3 - "baz" - test #2 in `./safe/fixtures/test_objects/basic-test-passing-object.js`
# Test run passed!
#   Passed: 3
#   Failed: 0
#   Total:  3'

  run ./bin/teenytest './safe/fixtures/test_*/*.js'

  [ "$output" = "$expected" ]
}

@test "with multiple glob arguments teenytest runs all tests in matching files" {
  expected='TAP version 13
1..3
ok 1 - test #1 in `./safe/fixtures/test_functions/basic-test-passing-function.js`
ok 2 - "bar" - test #1 in `./safe/fixtures/test_objects/basic-test-passing-object.js`
ok 3 - "baz" - test #2 in `./safe/fixtures/test_objects/basic-test-passing-object.js`
# Test run passed!
#   Passed: 3
#   Failed: 0
#   Total:  3'

  run ./bin/teenytest \
      './safe/fixtures/test_functions/basic-test-passing-function.js' \
      './safe/fixtures/test_objects/basic-test-passing-object.js'

  [ "$output" = "$expected" ]
}

@test "with multiple glob arguments resulting in duplicate file matches teenytest runs tests only once" {
  expected='TAP version 13
1..3
ok 1 - test #1 in `./safe/fixtures/test_functions/basic-test-passing-function.js`
ok 2 - "bar" - test #1 in `./safe/fixtures/test_objects/basic-test-passing-object.js`
ok 3 - "baz" - test #2 in `./safe/fixtures/test_objects/basic-test-passing-object.js`
# Test run passed!
#   Passed: 3
#   Failed: 0
#   Total:  3'

  run ./bin/teenytest \
      './safe/fixtures/test_*/*.js' \
      './safe/fixtures/test_functions/basic-test-passing-function.js' \
      './safe/fixtures/test_functions/basic-test-passing-function.js' \
      './safe/fixtures/test_objects/basic-test-passing-object.js' \
      './safe/fixtures/test_objects/basic-test-passing-object.js'

  [ "$output" = "$expected" ]
}

@test "with glob arguments following '--' teenytest runs all tests in matching files" {
  expected='TAP version 13
1..3
ok 1 - test #1 in `./safe/fixtures/test_functions/basic-test-passing-function.js`
ok 2 - "bar" - test #1 in `./safe/fixtures/test_objects/basic-test-passing-object.js`
ok 3 - "baz" - test #2 in `./safe/fixtures/test_objects/basic-test-passing-object.js`
# Test run passed!
#   Passed: 3
#   Failed: 0
#   Total:  3'

  run ./bin/teenytest -- \
      './safe/fixtures/test_functions/basic-test-passing-function.js' \
      './safe/fixtures/test_objects/basic-test-passing-object.js'

  [ "$output" = "$expected" ]
}

@test "with single '--example' named argument teenytest runs all tests in all files with matching name filters" {
  expected='TAP version 13
1..4
ok 1 - "named_test_aaa" - test #1 in `./safe/fixtures/filterable-examples-same-as-other-file.js`
ok 2 - "group_a group_b named_test_aaa" - test #2 in `./safe/fixtures/filterable-examples-same-as-other-file.js`
ok 3 - "named_test_aaa" - test #1 in `./safe/fixtures/filterable-examples.js`
ok 4 - "group_a group_b named_test_aaa" - test #2 in `./safe/fixtures/filterable-examples.js`
# Test run passed!
#   Passed: 4
#   Failed: 0
#   Total:  4'

  run ./bin/teenytest --example='named_test_aaa' './safe/fixtures/filterable-examples*.js'

  [ "$output" = "$expected" ]
}

@test "with multiple '--example' named arguments teenytest runs all tests in all files with matching name filters" {
  expected='TAP version 13
1..8
ok 1 - "named_test_aaa" - test #1 in `./safe/fixtures/filterable-examples-same-as-other-file.js`
ok 2 - "named_test_bbb" - test #2 in `./safe/fixtures/filterable-examples-same-as-other-file.js`
ok 3 - "group_a group_b named_test_aaa" - test #3 in `./safe/fixtures/filterable-examples-same-as-other-file.js`
ok 4 - "group_a group_b named_test_bbb" - test #4 in `./safe/fixtures/filterable-examples-same-as-other-file.js`
ok 5 - "named_test_aaa" - test #1 in `./safe/fixtures/filterable-examples.js`
ok 6 - "named_test_bbb" - test #2 in `./safe/fixtures/filterable-examples.js`
ok 7 - "group_a group_b named_test_aaa" - test #3 in `./safe/fixtures/filterable-examples.js`
ok 8 - "group_a group_b named_test_bbb" - test #4 in `./safe/fixtures/filterable-examples.js`
# Test run passed!
#   Passed: 8
#   Failed: 0
#   Total:  8'

  run ./bin/teenytest --example='named_test_aaa' --example='named_test_bbb' './safe/fixtures/filterable-examples*.js'

  [ "$output" = "$expected" ]
}

@test "with '#' filter suffix on single argument teenytest runs all tests in matching files with matching name filters" {
  expected='TAP version 13
1..4
ok 1 - "named_test_aaa" - test #1 in `./safe/fixtures/filterable-examples-same-as-other-file.js`
ok 2 - "group_a group_b named_test_aaa" - test #2 in `./safe/fixtures/filterable-examples-same-as-other-file.js`
ok 3 - "named_test_aaa" - test #1 in `./safe/fixtures/filterable-examples.js`
ok 4 - "group_a group_b named_test_aaa" - test #2 in `./safe/fixtures/filterable-examples.js`
# Test run passed!
#   Passed: 4
#   Failed: 0
#   Total:  4'

  run ./bin/teenytest './safe/fixtures/filterable-examples*.js#named_test_aaa'

  [ "$output" = "$expected" ]
}

@test "with per-argument '#' filter suffix teenytest runs all tests with matching name filters only for the file being filtered" {
  expected='TAP version 13
1..4
ok 1 - "named_test_aaa" - test #1 in `./safe/fixtures/filterable-examples.js`
ok 2 - "group_a group_b named_test_aaa" - test #2 in `./safe/fixtures/filterable-examples.js`
ok 3 - "named_test_bbb" - test #1 in `./safe/fixtures/filterable-examples-same-as-other-file.js`
ok 4 - "group_a group_b named_test_bbb" - test #2 in `./safe/fixtures/filterable-examples-same-as-other-file.js`
# Test run passed!
#   Passed: 4
#   Failed: 0
#   Total:  4'

  run ./bin/teenytest \
      './safe/fixtures/filterable-examples.js#named_test_aaa' \
      './safe/fixtures/filterable-examples-same-as-other-file.js#named_test_bbb'

  [ "$output" = "$expected" ]
}

@test "with per-argument '#' filters resulting in different matches within the same file teenytest runs all matching tests for the file" {
  expected='TAP version 13
1..4
ok 1 - "named_test_aaa" - test #1 in `./safe/fixtures/filterable-examples.js`
ok 2 - "named_test_bbb" - test #2 in `./safe/fixtures/filterable-examples.js`
ok 3 - "group_a group_b named_test_aaa" - test #3 in `./safe/fixtures/filterable-examples.js`
ok 4 - "group_a group_b named_test_bbb" - test #4 in `./safe/fixtures/filterable-examples.js`
# Test run passed!
#   Passed: 4
#   Failed: 0
#   Total:  4'

  run ./bin/teenytest \
      './safe/fixtures/filterable-examples.js#named_test_aaa' \
      './safe/fixtures/filterable-examples.js#named_test_bbb'

  [ "$output" = "$expected" ]
}

@test "with per-argument '#' filters resulting in duplicate matches teenytest runs all matching tests only once removing duplicates" {
  expected='TAP version 13
1..6
ok 1 - "named_test_aaa" - test #1 in `./safe/fixtures/filterable-examples-same-as-other-file.js`
ok 2 - "named_test_bbb" - test #2 in `./safe/fixtures/filterable-examples-same-as-other-file.js`
ok 3 - "group_a group_b named_test_aaa" - test #3 in `./safe/fixtures/filterable-examples-same-as-other-file.js`
ok 4 - "group_a group_b named_test_bbb" - test #4 in `./safe/fixtures/filterable-examples-same-as-other-file.js`
ok 5 - "named_test_aaa" - test #1 in `./safe/fixtures/filterable-examples.js`
ok 6 - "group_a group_b named_test_aaa" - test #2 in `./safe/fixtures/filterable-examples.js`
# Test run passed!
#   Passed: 6
#   Failed: 0
#   Total:  6'

  run ./bin/teenytest \
      './safe/fixtures/filterable-*.js#named_test_aaa' \
      './safe/fixtures/filterable-examples.js#named_test_aaa' \
      './safe/fixtures/filterable-examples-same-as-other-file.js#named_test_aaa' \
      './safe/fixtures/filterable-examples-same-as-other-file.js#named_test_bbb'

  [ "$output" = "$expected" ]
}

@test "with ':' filter suffix on single argument teenytest runs all test in matching file with matching line number filter" {
  expected='TAP version 13
1..1
ok 1 - "example_on_line_2" - test #1 in `./safe/fixtures/filterable-examples.js`
# Test run passed!
#   Passed: 1
#   Failed: 0
#   Total:  1'

  run ./bin/teenytest './safe/fixtures/filterable-examples.js:2'

  [ "$output" = "$expected" ]
}

@test "with per-argument ':' filter suffix teenytest runs all tests with matching line number filter only for the file being filtered" {
  expected='TAP version 13
1..2
ok 1 - "example_on_line_2" - test #1 in `./safe/fixtures/filterable-examples.js`
ok 2 - "example_on_line_3" - test #1 in `./safe/fixtures/filterable-examples-same-as-other-file.js`
# Test run passed!
#   Passed: 2
#   Failed: 0
#   Total:  2'

  run ./bin/teenytest \
      './safe/fixtures/filterable-examples.js:2' \
      './safe/fixtures/filterable-examples-same-as-other-file.js:3'

  [ "$output" = "$expected" ]
}

@test "with per-argument ':' filters resulting in different matches within the same file teenytest runs all matching tests for the file" {
  expected='TAP version 13
1..2
ok 1 - "example_on_line_2" - test #1 in `./safe/fixtures/filterable-examples.js`
ok 2 - "example_on_line_3" - test #2 in `./safe/fixtures/filterable-examples.js`
# Test run passed!
#   Passed: 2
#   Failed: 0
#   Total:  2'

  run ./bin/teenytest \
      './safe/fixtures/filterable-examples.js:2' \
      './safe/fixtures/filterable-examples.js:3'

  [ "$output" = "$expected" ]
}

@test "with per-argument ':' filters resulting in duplicate matches teenytest runs all matching tests only once removing duplicates" {
  expected='TAP version 13
1..3
ok 1 - "example_on_line_2" - test #1 in `./safe/fixtures/filterable-examples-same-as-other-file.js`
ok 2 - "example_on_line_3" - test #2 in `./safe/fixtures/filterable-examples-same-as-other-file.js`
ok 3 - "example_on_line_2" - test #1 in `./safe/fixtures/filterable-examples.js`
# Test run passed!
#   Passed: 3
#   Failed: 0
#   Total:  3'

  run ./bin/teenytest \
      './safe/fixtures/filterable-*.js:2' \
      './safe/fixtures/filterable-examples.js:2' \
      './safe/fixtures/filterable-examples-same-as-other-file.js:3' \
      './safe/fixtures/filterable-examples-same-as-other-file.js:3'

  [ "$output" = "$expected" ]
}

@test "with '#' and :' filters both matching the same test within a file teenytest runs the test once per file without duplicates" {
  expected='TAP version 13
1..2
ok 1 - "example_on_line_2" - test #1 in `./safe/fixtures/filterable-examples.js`
ok 2 - "example_on_line_3" - test #2 in `./safe/fixtures/filterable-examples.js`
# Test run passed!
#   Passed: 2
#   Failed: 0
#   Total:  2'

  run ./bin/teenytest \
      './safe/fixtures/filterable-examples.js:2' \
      './safe/fixtures/filterable-examples.js#example_on_line_2' \
      './safe/fixtures/filterable-examples.js:3' \
      './safe/fixtures/filterable-examples.js#example_on_line_3'

  [ "$output" = "$expected" ]
}
