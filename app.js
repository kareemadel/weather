const yargs = require('yargs');
const axios = require('axios');


const argv = yargs
    .options({
        a: {
            demand: true,
            alias: 'address',
            describe: 'Address to fetch weather for',
            string: true,
        },
    })
    .help()
    .alias('help', 'h')
    .argv;

let encodedAddress = encodeURIComponent(argv.a);
let geocodeURL = `http://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;
let weatherURL = 'https://api.darksky.net/forecast/0a97112707f3ed8eea9450fc2a647817/';

axios({
    method: 'get',
    url: geocodeURL,
    responseType: 'json',
}).then((response) => {
    if (response.data.status === 'OK') {
        let lat = response.data.results[0].geometry.location.lat;
        let lng = response.data.results[0].geometry.location.lng;
        return axios({
            method: 'get',
            url: weatherURL + `${lat},${lng}`,
            responseType: 'json',
        });
    } else {
        throw new Error('Unable to find the address');
    }
}).then((response) => {
    if (response.status == 200) {
        console.log(response.data.currently.temperature);
    } else {
        throw new Error('Unable to fetch weather.');
    }
}).catch((errMessage) => {
    console.log(errMessage.message);
});
