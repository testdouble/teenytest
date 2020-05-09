#!/usr/bin/env bats

@test "accepts line number is path suffix" {
  cd "$BATS_TEST_DIRNAME/../example/esm-node"

  node supports-esm.js || skip "Node version doesn't support ESM. Skipping."

  run npm test -- test/lib/dog-test.mjs:10

  [[ $status -eq 0 ]]
  [[ "$output" =~ 1..1 ]]
  [[ "$output" =~ 'test #1 in `test/lib/dog-test.mjs`' ]]
}

@test "failed tests report not-ok" {
  cd "$BATS_TEST_DIRNAME/../example/esm-node"

  node supports-esm.js || skip "Node version doesn't support ESM. Skipping."

  run npm test

  [[ $status -eq 1 ]]
  [[ "$output" =~ 'ok 5 - "bark once" - test #1 in `test/lib/dog-test.mjs`' ]]
  [[ "$output" =~ 'not ok 9 - "blueIsRed" - test #1 in `test/lib/single-function.js`' ]]
}
