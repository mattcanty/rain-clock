#!/bin/sh

apt-get update
apt-get install zip -qy

npm run build --prefix aws/lambda/forecast