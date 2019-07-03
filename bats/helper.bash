# make a reliable fill path to this folder
DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

# load helpers in a way that will work regardless of where they are called from
# load ${DIR}/helpers/bats-mock/stub.bash

# give any test file a reliable way to source something to test
PROJECT_DIR=$(cd ${DIR}/../ && pwd)

# bats uses the Mac OS temp directory, which is obfuscated
# for debugging nice to see WTF...
# echo "${BATS_MOCK_TMPDIR}" >&3
