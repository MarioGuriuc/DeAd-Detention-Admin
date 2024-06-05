#!/bin/bash

mongod --fork --logpath /var/log/mongod.log

sleep 5

python3 db_script.py

tail -f /dev/null
