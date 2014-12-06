#!/bin/sh

mkdir build && cd build/

git clone https://github.com/nicroto/nsv.git

cd nsv

git checkout gh-pages

rm -rf *

cp -R ../../src/server/client/ .

git add --all

git commit -m "update website"

git push