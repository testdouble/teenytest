#!/usr/bin/env bats

load helper

DESCRIBE="teenytest"

setup() {
	echo "set up"
}

teardown() {
	echo "tear down"
}

@test "when there are no tests found ${DESCRIBE} prints appropriate TAP ouput" {
  expected="TAP version 13
1..0
# Test run passed!
#   Passed: 0
#   Failed: 0
#   Total:  0"

  result="$(./bin/teenytest "./nothing/here/*")"

  [ "$result" = "$expected" ]
}

@test "when there is a quoted test finder string ${DESCRIBE} finds all test files" {
  expected="TAP version 13
1..6
ok 1 - test #1 in \`./bats/fixtures/another_folder/basic-test-passing-function.js\`
ok 2 - \"foo biz bar\" - test #1 in \`./bats/fixtures/deep-name.js\`
ok 3 - \"foo biz box\" - test #2 in \`./bats/fixtures/deep-name.js\`
ok 4 - \"foo baz\" - test #3 in \`./bats/fixtures/deep-name.js\`
ok 5 - \"bar\" - test #1 in \`./bats/fixtures/some_folder/basic-test-passing-object.js\`
ok 6 - \"baz\" - test #2 in \`./bats/fixtures/some_folder/basic-test-passing-object.js\`
# Test run passed!
#   Passed: 6
#   Failed: 0
#   Total:  6"

  result="$(./bin/teenytest "./bats/fixtures/**/*.js")"

  [ "$result" = "$expected" ]
}

@test "when there is an unquoted glob ${DESCRIBE} only finds the last file" {
  expected="TAP version 13
1..2
ok 1 - \"bar\" - test #1 in \`./bats/fixtures/some_folder/basic-test-passing-object.js\`
ok 2 - \"baz\" - test #2 in \`./bats/fixtures/some_folder/basic-test-passing-object.js\`
# Test run passed!
#   Passed: 2
#   Failed: 0
#   Total:  2"

  result="$(./bin/teenytest ./bats/fixtures/**/*.js)"

  [ "$result" = "$expected" ]
}
