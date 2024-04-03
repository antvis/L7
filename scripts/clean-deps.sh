#!/bin/bash

pnpm --parallel -r run clean

pnpm --parallel -r exec rm -rf node_modules

rm -rf node_modules yarn.lock package-lock.json pnpm-lock.yaml
