#!/bin/sh

CONTAINER_ALREADY_STARTED="CONTAINER_ALREADY_STARTED_PLACEHOLDER"
if [ ! -e $CONTAINER_ALREADY_STARTED ]; then
touch $CONTAINER_ALREADY_STARTED
  echo "-- First container startup --"
  apk update && apk upgrade
  apk add --no-cache \
    bash \
    nodejs \
    npm
  addgroup -S node && adduser -S -D -G node node
  chown -R :node . && chmod -R 774 .
  su -s /bin/bash -c 'npm ci && npm start' node
else
  echo "-- Not first container startup --"
  su -s /bin/bash -c 'npm ci && npm start' node
fi
