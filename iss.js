const request = require('request');

const fetchMyIP = callback => {
  const URL = 'https://api.ipify.org?format=json';
  request(URL, (err, response, body) => {
    // check if error
    if (err) {
      callback(err, null);
      return;
    }
    // check if non-200 status code
    if (response.statusCode !== 200) {
      const msg = `Status code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    // our request was successful
    const data = JSON.parse(body);
    callback(null, data.ip);
  });
};

const fetchCoordsByIP = (ip, callback) => {
  const URL = 'https://freegeoip.app/json/' + ip;
  request(URL, (err, response, body) => {
    // check if error
    if (err) {
      callback(err, null);
      return;
    }
    // check if non-200 status code
    if (response.statusCode !== 200) {
      const msg = `Status code ${response.statusCode} when fetching geolocation. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    // our request was successful
    const data = JSON.parse(body);
    const latLonData = {
      latitude: data.latitude,
      longitude: data.longitude,
    };
    callback(null, latLonData);
  });
};

const fetchISSFlyOverTimes = (coords, callback) => {
  const URL = 'http://api.open-notify.org/iss-pass.json?lat=' + coords.latitude + '&lon=' + coords.longitude;
  request(URL, (err, response, body) => {
    // check if error
    if (err) {
      callback(err, null);
      return;
    }
    // check if non-200 status code
    if (response.statusCode !== 200) {
      const msg = `Status code ${response.statusCode} when fetching ISS flyover times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    // our request was successful
    const data = JSON.parse(body);
    callback(null, data.response);
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes };