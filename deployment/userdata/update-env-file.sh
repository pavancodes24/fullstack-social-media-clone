#!/bin/bash


aws s3 sync s3://chatapp-env-files-pa1/develop .
unzip env-file.zip
cp .env.develop .env
rm .env.develop
sed -i e "s|\(^REDIS_HOST=\).*|REDIS_HOST=redis://$ELASTICACHE_ENDPOINT_REDIS:6379|g" .env
rm -rf env-file.zip
cp .env .env.develop
zip env-file.zip .env.develop
aws --region us-east-1 s3 cp env-file.zip s3://chatapp-env-files-pa1/develop/
rm -rf .env*
rm -rf env-file.zip

