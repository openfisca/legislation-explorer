#!/bin/bash

test -d public/assets || mkdir -p public/assets
test -d public/assets/bootstrap || cp -r node_modules/bootstrap/dist public/assets/bootstrap
