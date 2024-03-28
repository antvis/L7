#!/bin/bash

npx lerna run clean

npx lerna clean --yes

rm -rf node_modules yarn.lock package-lock.json
