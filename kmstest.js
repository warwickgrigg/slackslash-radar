var Promise = require('bluebird');

var decrypt = require('./kms.js').decrypt;

new Promise.all([
    decrypt('./kms/google.hash').then(function(hash) {
        console.log('hash', hash);
    }),
    decrypt('./kms/wunderground.hash').then(function(hash) {
        console.log('hash', hash);
    })  
]).then(() => {
    console.log('done')
})
