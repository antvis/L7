#!/bin/bash

pnpm exec eslint examples/ __tests__/ --fix

pnpm --filter !@antv/l7-site  lint --fix
