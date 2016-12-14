#!/usr/bin/env bash

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


rm -rf dist

echo Installing dependencies
npm install

echo Running build for production
npm run build


if [[ $? -ne 0 ]]; then
  echo "Build failed"
  exit 1
fi

echo "Publishing plugins to $awsbucketname"

AWS_ACCESS_KEY_ID=$awsaccesskey  AWS_SECRET_ACCESS_KEY=$awssecretkey AWS_S3_BUCKET_NAME=$awsbucketname node s3Upload.js



#echo "{\"Plugins\": \"#$(git rev-parse --short HEAD)\"}" > dist/versions.json

