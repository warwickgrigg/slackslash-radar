const botBuilder = require('claudia-bot-builder');
const slackTemplate = botBuilder.slackTemplate;
const Promise = require('bluebird');
const rp = require('request-promise');
const decrypt = require('./kms.js').decrypt;

let GOOGLEKEY = '';
let WUNDERKEY = '';

let getKeys = () => {
    return new Promise.all([

        decrypt('./kms/google.hash').then(hash => {
            GOOGLEKEY = hash;
        }),

        decrypt('./kms/wunderground.hash').then(hash => {
            WUNDERKEY = hash;
        })

    ]);
}

let getData = (request) => {
    return new Promise((resolve, reject) => {

        let options = {
            uri: `https://maps.googleapis.com/maps/api/geocode/json?key=${GOOGLEKEY}&address=${request.text}`,
            json: true
        };

        return rp(options)
            .then(body => {

                let message = new slackTemplate(),
                    lat = body.results[0].geometry.location.lat,
                    lng = body.results[0].geometry.location.lng;

                let wgif = `http://api.wunderground.com/api/${WUNDERKEY}/animatedradar/image.gif?centerlat=${lat}&centerlon=${lng}&num=15&smooth=0&width=500&height=500&radius=60&newmaps=1&delay=25&noclutter=1`

                message
                    .addAttachment('A1')
                    .channelMessage(true)
                    .addTitle(`Radar for ${request.text}`)
                    .addImage(wgif)

                resolve(message.get());

            })
            .catch(err => {

                resolve({
                    text: err.error_message,
                    response_type: 'in_channel'
                });

            });
    });
}

module.exports = botBuilder(request => {

    return getKeys().then(() => {
        return getData(request)
    })

});
