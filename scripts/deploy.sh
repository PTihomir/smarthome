#!/bin/bash

SERVER=( '192.168.88.236' )
DEPLOY_PATH=/home/pi/Workspaces/smarthome/
REPO=PTihomir@smarthome.git
USER=pi

ENVIRONMENT=${1:-"origin"}
REF=${2:-"master"}

trap 'test -n "$SUCCESS" || echo "  error: aborted"' EXIT
echo "* Deploying $ENVIRONMENT/$REF"

ssh $USER@$SERVER "cd $DEPLOY_PATH && \
                   git reset --hard && \
                   git checkout $REF && \
                   git pull && \
                   npm install --production"
                   #  && \
                   # /etc/init.d/your_app restart"
SUCCESS=true
