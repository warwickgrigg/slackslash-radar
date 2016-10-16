'use strict';

var botBuilder = require('claudia-bot-builder');
var slackTemplate = botBuilder.slackTemplate;
var Promise = require('bluebird');
var rp = require('request-promise');
var decrypt = require('./kms.js').decrypt;

var GOOGLEKEY = '';
var WUNDERKEY = '';

var getKeys = function getKeys() {
    return new Promise.all([decrypt('./kms/google.hash').then(function (hash) {
        GOOGLEKEY = hash;
    }), decrypt('./kms/wunderground.hash').then(function (hash) {
        WUNDERKEY = hash;
    })]);
};

var getData = function getData(request) {
    return new Promise(function (resolve, reject) {

        var options = {
            uri: 'https://maps.googleapis.com/maps/api/geocode/json?key=' + GOOGLEKEY + '&address=' + request.text,
            json: true
        };

        return rp(options).then(function (body) {

            var message = new slackTemplate(),
                lat = body.results[0].geometry.location.lat,
                lng = body.results[0].geometry.location.lng;

            var wgif = 'http://api.wunderground.com/api/' + WUNDERKEY + '/animatedradar/image.gif?centerlat=' + lat + '&centerlon=' + lng + '&num=15&smooth=0&width=500&height=500&radius=60&newmaps=1&delay=25&noclutter=1';

            message.addAttachment('A1').channelMessage(true).addTitle('Radar for ' + request.text).addImage(wgif);

            resolve(message.get());
        }).catch(function (err) {

            resolve({
                text: err.error_message,
                response_type: 'in_channel'
            });
        });
    });
};

module.exports = botBuilder(function (request) {

    return getKeys().then(function () {
        return getData(request);
    });
});
