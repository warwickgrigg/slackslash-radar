// aws kms encrypt --region us-west-2 --key-id <kms-key-id> --plaintext "<whatever>" --query CiphertextBlob --output text | base64 --decode > ./kms/output.hash

var fs = require('fs');
var Promise = require('bluebird');
var AWS = require('aws-sdk');
var kms = new AWS.KMS({ region:'us-west-2' });

var getFile = function(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(data)
            }
        })
    })
}

var kmsDecrypt = function(params) {
    return new Promise((resolve, reject) => {
        kms.decrypt(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
                reject(err);
            } else {
                resolve(data['Plaintext'].toString());
            }
        });        
    })
}

exports.decrypt = function(path) {
    return getFile(path)
        .then((result) => {
            return kmsDecrypt({ CiphertextBlob: result })
        })
}
