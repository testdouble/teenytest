#!/usr/bin/env bats

@test "accepts line number is path suffix" {
  cd "$BATS_TEST_DIRNAME/../example/simple-node"

  run npm test -- test/lib/multi-word-names.js:10

  [[ $status -eq 0 ]]
  [[ "$output" =~ 1..1 ]]
  [[ "$output" =~ 'test #1 in `test/lib/multi-word-names.js`' ]]
}

@test "failed tests report not-ok" {
  cd "$BATS_TEST_DIRNAME/../example/simple-node"

  run npm test

  [[ $status -eq 1 ]]
  [[ "$output" =~ 'not ok 9 - "blueIsRed" - test #1 in `test/lib/single-function.js`' ]]
}
