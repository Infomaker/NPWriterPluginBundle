#!/usr/bin/env bash

# Use node version in .nvmrc if it exists
if [[ -f .nvmrc ]]; then
  if [[ -f ~/.bashrc ]]; then
    echo "Initiating nvm"
    . ~/.bashrc
  fi
  nvm install
fi

OLD_DIR=`pwd`

if [[ -z $1 ]]; then
  echo AWS_ACCESS_KEY_ID is not provided
  exit 1
else
  awsaccesskey=$1
fi


if [[ -z $2 ]]; then
  echo AWS_SECRET_ACCESS_KEY is not provided
  exit 1
else
  awssecretkey=$2
fi

if [[ -z $3 ]]; then
  echo AWS_S3_BUCKET_NAME is not provided
  exit 1
else
  awsbucketname=$3
fi

if [[ -n $4 ]]; then
  awsdirectory=$4
fi

git_tag=dev
if [[ -n $5 ]]; then
  git_tag=$5
fi


rm -rf dist

echo Installing dependencies
npm install

echo Running build for production
VERSION=$git_tag npm run build


if [[ $? -ne 0 ]]; then
  echo "Build failed"
  exit 1
fi

echo "Publishing plugins to $awsbucketname"
echo "{\"Plugins\": \"#$(git rev-parse --short HEAD)\"}" > dist/versions.json

AWS_ACCESS_KEY_ID=$awsaccesskey \
AWS_SECRET_ACCESS_KEY=$awssecretkey \
AWS_S3_BUCKET_NAME=$awsbucketname \
AWS_S3_DIRECTORY=$awsdirectory \
node s3Upload.js




