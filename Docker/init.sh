#!/bin/bash
set -e

echo "Starting SSH ..."
service ssh start

echo "Starting NGINX ..."
service nginx start

echo "Starting Web.App, Web.Api.Versioned, HypernovaComponentServer, JsonServer managed by pm2"
pm2-runtime /usr/local/bin/pm2-configuration.yml


