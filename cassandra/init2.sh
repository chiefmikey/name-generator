#!/bin/sh

CONTAINER_ALREADY_STARTED="CONTAINER_ALREADY_STARTED_PLACEHOLDER"
if [ ! -e $CONTAINER_ALREADY_STARTED ]; then
touch $CONTAINER_ALREADY_STARTED
  echo "-- First container startup --"
  apk update && apk upgrade
  apk add --no-cache \
    bash \
    sudo \
    openjdk8-jre \
    python3
  wget http://apache.mirror.digitalpacific.com.au/cassandra/4.0.0/apache-cassandra-4.0.0-bin.tar.gz
  tar -xzvf /cassandra/apache-cassandra-4.0.0-bin.tar.gz && rm -rf /cassandra/apache-cassandra-4.0.0-bin.tar.gz
  addgroup -S cassandra && adduser -S -D -G cassandra cassandra
  mkdir /var/lib/cassandra && mkdir /var/log/cassandra
  chown -R :cassandra /var/lib/cassandra && chown -R :cassandra /var/log/cassandra
  chown -R :cassandra /cassandra && chmod -R 774 /cassandra
  cd /cassandra/apache-cassandra-4.0.0
  su -s /bin/bash -c 'bin/cassandra -f' cassandra
else
  echo "-- Not first container startup --"
  cd /cassandra/apache-cassandra-4.0.0
  su -s /bin/bash -c 'bin/cassandra -f' cassandra
fi
