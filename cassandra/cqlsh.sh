#!/bin/sh

apk update && apk upgrade
apk add --no-cache docker
addgroup root docker
sudo dockerd
sudo docker kill cass-helper && docker rm cass-helper
cd /cassandra/apache-cassandra-4.0.0
su -s /bin/bash -c 'bin/cqlsh' cassandra
