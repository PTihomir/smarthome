#!/bin/bash
echo "Create config files"

CLIENT_CONFIG=client_config.js
CLIENT_CONFIG_RENAMED=config.js
SERVER_CONFIG_=server_config.js
SERVER_CONFIG_RENAMED=config.js

TEMPLATE_PATH=./templates/
APP_PATH=./app/
SERVER_PATH=./bin/

if [ -f $APP_PATH$CLIENT_CONFIG_RENAMED ]; then
    read -p "App config file already created. Want to overwrite it? (Y|n)" -n 1 -r
    echo    # (optional) move to a new line
    if [[ $REPLY =~ ^[Yy]$ ]]
    then
        cp $TEMPLATE_PATH$CLIENT_CONFIG $APP_PATH$CLIENT_CONFIG_RENAMED
    fi
else
    cp $TEMPLATE_PATH$CLIENT_CONFIG $APP_PATH$CLIENT_CONFIG_RENAMED
fi


if [ -f $SERVER_PATH$SERVER_CONFIG_RENAMED ]; then
    read -p "Server config file already created. Want to overwrite it? (Y|n)" -n 1 -r
    echo    # (optional) move to a new line
    if [[ $REPLY =~ ^[Yy]$ ]]
    then
        cp $TEMPLATE_PATH$SERVER_CONFIG $SERVER_PATH$SERVER_CONFIG_RENAMED
    fi
else
    cp $TEMPLATE_PATH$SERVER_CONFIG $SERVER_PATH$SERVER_CONFIG_RENAMED
fi

