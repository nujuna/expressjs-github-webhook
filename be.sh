#!/bin/bash

BRANCH=$1
WORKDIR=$2
REPO="git@github.com:nujuna/strapi-franchise.git"

echo "Backend [$BRANCH]:[$HOME/$WORKDIR]"

cd $HOME/$WORKDIR

git pull origin $BRANCH

yarn install

yarn build

if [ $WORKDIR = "app" ] 
then
	pm2 reload $HOME/pm2/ecosystem.config.js --only be-production
else
	pm2 reload $HOME/pm2/ecosystem.config.js --only be-development
fi

echo "Backend [$BRANCH]:[$HOME/$WORKDIR] (DONE)"
