#!/bin/bash
docker-compose stop
docker system prune -a
git pull
docker-compose up -d