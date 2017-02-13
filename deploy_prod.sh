#!/bin/bash

pwd
git branch

git pull
npm run build

echo "Restarting legislation-explorer service..."
sudo systemctl restart legislation-explorer.service