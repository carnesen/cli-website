#!/bin/bash

set -eo pipefail

rm -rf dist/
cp -r node_modules/@carnesen/cli/dist dist
webpack --config webpack.config.js
mv examples/ dist/examples/
