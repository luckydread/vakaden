#!/bin/sh
# Reload Nginx after certificate renewal
docker exec vakaden_frontend nginx -s reload
