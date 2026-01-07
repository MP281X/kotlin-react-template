#!/bin/sh

. "$( cd "$( dirname "$0" )" && pwd )/+helpers.sh"

log "KILL PROCESSES"
kill_process 8080 # kill backend
kill_process 3000 # kill frontend

log "CLEAN PROJECTS"
delete "*.log"

log "CLEAN NODE PROJECT"
delete "dist"
delete ".turbo"
delete ".pnpm-store"
delete ".tsbuildinfo"
delete "node_modules"

log "CLEAN KOTLIN PROJECT"
delete "out"
delete "build"
delete "target"

log "INSTALL NODE PACKAGES"
pnpm install --recursive --quiet

log "INSTALL KOTLIN PACKAGES"
(cd apps/backend &&  ./mvnw clean dependency:resolve -q -DskipTests)

log "STOP CONTAINERS"
docker compose -f docker/docker-compose.yaml down --remove-orphans --timeout 0

log "RESTART CONTAINERS"
docker compose -f docker/docker-compose.yaml up --detach --wait --build

log "MIGRATE DATABASE & CODEGEN"
pnpm run codegen
