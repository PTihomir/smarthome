smarthome
=========


Install SQLITE3 to raspberry pi
===============================

Remove existing slite3 from the projects node_modules and run

```bash
    npm install sqlite3 --build-from-source
```


How to create the service for server
====================================

Create the next file named 'smarthome' in the `/etc/init.d/` directory.

```bash
    #!/bin/bash

    ### BEGIN INIT INFO
    # Provides:          smarthome
    # Required-Start:    $all
    # Required-Stop:
    # Default-Start:     2 3 4 5
    # Default-Stop:      0 1 6
    # Short-Description: Run server for smarthome project.
    ### END INIT INFO

    # Directory where the nodejs app is located
    DIR=/home/pi/Workspace/smarthome/bin

    TMP_DIR=/home/pi/.config/smarthome

    PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
    NODE_PATH=/home/pi/.nvm/versions/node/v5.7.0/lib/node_modules/
    NODE=/home/pi/.nvm/versions/node/v5.7.0/bin/node

    test -x $NODE || exit 0

    function start_app {
      NODE_ENV=production nohup "$NODE" "$DIR/main.js" 1>>"$TMP_DIR/app.log" 2>&1 &
      echo $! > "$TMP_DIR/app.pid"
    }

    function stop_app {
      kill `cat $TMP_DIR/my_app.pid`
    }

    case $1 in
       start)
          start_app ;;
        stop)
          stop_app ;;
        restart)
          stop_app
          start_app
          ;;
        *)
          echo "usage: test {start|stop}" ;;
    esac
    exit 0
```
