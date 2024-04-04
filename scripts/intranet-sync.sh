#!/bin/bash

pnpm --filter "./packages/*" --parallel -r exec tnpm sync
