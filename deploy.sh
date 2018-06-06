#!/bin/sh

PKG_BUCKET=rainclock-management-rainclocklambdabucket-978qdlqdm11f
PUB_BUCKET=rainclock-rainclockpublicbucket-16zshove7uwcq
STACK_NAME=rainclock

(cd aws/cloudformation/templates;
    mkdir -p .build
    sam validate -t *.yaml
    sam package --template-file rainclock.yaml --s3-bucket $PKG_BUCKET --output-template-file .build/rainclock.yaml
    sam deploy --template-file .build/rainclock.yaml --stack-name $STACK_NAME \
        --parameter-overrides \
            DarkSkyApiKey=$DARKSKY_APIKEY \
        --capabilities CAPABILITY_IAM \
        --region eu-west-2
)

aws s3 sync public s3://$PUB_BUCKET/ --delete