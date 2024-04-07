#!/bin/bash

pnpm --filter !@antv/l7-test-utils --filter "./packages/*" --parallel -r exec tnpm sync
