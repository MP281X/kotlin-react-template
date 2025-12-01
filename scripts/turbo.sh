#!/bin/sh

. "$( cd "$( dirname "$0" )" && pwd )/+helpers.sh"

if [ $2 = "dev" ]; then
	kill_process 8080 # kill backend
	kill_process 3000 # kill frontend
fi

pnpm exec turbo $@
