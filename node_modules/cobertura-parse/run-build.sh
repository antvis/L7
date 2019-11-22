#!/bin/bash

npm run testcover

RESULT=$?

COMMIT="${TRAVIS_COMMIT_RANGE##*...}"

if [ $RESULT == 0 ]; then
  echo "publish coverage for $COMMIT"
  curl -F coverage=@coverage/lcov.info "https://cvr.vokal.io/coverage?owner=$REPO_OWNER&repo=$REPO_NAME&commit=$COMMIT&coveragetype=lcov"
else
  curl -X POST "https://cvr.vokal.io/coverage/abort?owner=$REPO_OWNER&repo=$REPO_NAME&commit=$COMMIT"
fi

exit $RESULT
