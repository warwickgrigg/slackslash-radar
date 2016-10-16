# slackslash-radar
A Claudiajs bot which retrieves a Wunderground radar animated gif and posts to Slack

1. `npm install`
1. `npm run watch` or `npm run build`
1. create: `npm run claudia -- create --region us-west-2 --api-module index --configure-slack-slash-command`
or
1. update: `npm run claudia -- update`

Encrypt new API keys via:
`aws kms encrypt --region us-west-2 --key-id <kms-key-id> --plaintext "<whatever>" --query CiphertextBlob --output text | base64 --decode > ./kms/output.hash`

