#!/bin/bash
cd "$(dirname "$0")"

# Zip TodoServer folder
zip -j todo-server.zip TodoServer/build/server.js

# Zip UserServer folder
zip -j user-server.zip UserServer/build/server.js