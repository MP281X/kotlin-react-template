#!/bin/sh

# terminate script with ctrl_c
set -e
trap ctrl_c INT

# colored logs
log() {
	echo ""
	echo "\033[1;33m$1\033[0m"
	echo ""
}

# delete files and folders
delete() {
  find . -type f -name "$1" -exec rm -rf {} +;
	find . -type d -name "$1" -exec rm -rf {} +;
}

# kill process using port if it finds one
kill_process() {
		pid=$(ss -tulnp | grep ":$1" | awk -F 'pid=' '{print $2}' | cut -d',' -f1)
    if [ -n "$pid" ] && [ "$pid" != "$$" ]; then
        kill -9 "$pid" && echo "Killed process $pid on port $1"
    fi
}

# load .env
[ -f ".env" ] && export $(cat .env | xargs)

# Java 21
export JAVA_HOME="$(
  for java_bin in /usr/lib/jvm/*/bin/java; do
    "$java_bin" -version 2>&1 | grep -q 'version "21' && {
      dirname "$(dirname "$java_bin")"
      break
    }
  done
)"
export PATH="$JAVA_HOME/bin:$PATH"

clear;
