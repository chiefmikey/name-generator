#!/bin/sh

apk update && apk upgrade
apk add --no-cache docker sudo
addgroup root docker
sudo dockerd
sudo docker exec -ti cassandra /cassandra/cqlsh
