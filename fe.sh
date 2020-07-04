#!/bin/bash

BRANCH=$1
WORKDIR=$2
REPO="git@github.com:akoharu/ng-franchise.git"
REPONAME="ng-franchise"

echo "Frontend [$BRANCH]:[$HOME/$WORKDIR]"

cd $HOME/$WORKDIR/$REPONAME

git pull origin $BRANCH

npm install

npm run build && npm run post-build

cp -r $HOME/$WORKDIR/$REPONAME/dist/* $HOME/$WORKDIR

echo "Frontend [$BRANCH]:[$HOME/$WORKDIR] (DONE)"
