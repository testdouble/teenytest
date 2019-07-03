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

@test "when there is a valid path ${DESCRIBE} finds a test file" {
  expected="TAP version 13
1..2
ok 1 - \"bar\" - test #1 in \`./safe/fixtures/basic-test-passing-object.js\`
ok 2 - \"baz\" - test #2 in \`./safe/fixtures/basic-test-passing-object.js\`
# Test run passed!
#   Passed: 2
#   Failed: 0
#   Total:  2"

  result="$(./bin/teenytest "./safe/fixtures/basic-test-passing-object.js")"

  [ "$result" = "$expected" ]
}