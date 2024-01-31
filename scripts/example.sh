#!/bin/sh
# deno run -A ddb.ts example-file-to-debug.ts # Note: This doesn't work due to BadResource error
deno run -A --inspect-brk example-file-to-debug.ts