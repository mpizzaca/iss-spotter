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

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */ 
const nextISSTimesForMyLocation = callback => {
  // fetch IP
  fetchMyIP((err, ip) => {
    // fetch coords by IP
    if (err) return callback(err, null);
    fetchCoordsByIP(ip, (err, coords) => {
      // fetch ISS flyover times
      if (err) return callback(err, null);
      fetchISSFlyOverTimes(coords, (err, times) => {
        // callback
        if (err) return callback (err, null);
        return callback(null, times);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };