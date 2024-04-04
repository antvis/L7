#!/bin/bash

pnpm exec eslint examples/ __tests__/

pnpm --filter !@antv/l7-site --parallel -r lint
