const request = require('request');

const requestJSONFrom = (url, callback) => {
  request(url, (err, response, body) => {
    if (err) return callback(err, null);
    try {
      const data = JSON.parse(body);
      return callback(null, data);
    } catch (err) {
      return callback(err, null);
    }
  });
};

const fetchMyIP = callback => {
  const url = 'https://api.ipify.org?format=json';
  requestJSONFrom(url, (err, ip) => {
    if (err) return callback(err, null);
    return callback(null, ip.ip);
  });
};

const fetchCoordsByIP = (ip, callback) => {
  const url = 'https://freegeoip.app/json/' + ip;
  requestJSONFrom(url, (err, { latitude, longitude }) => {
    if (err) return callback(err, null);
    return callback(null, { latitude, longitude });
  });
};

const fetchISSFlyOverTimes = ({ latitude, longitude }, callback) => {
  const url = 'http://api.open-notify.org/iss-pass.json?lat=' + latitude + '&lon=' + longitude;
  requestJSONFrom(url, (err, passTimes) => {
    if (err) return callback(err, null);
    return callback(null, passTimes.response);
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
        if (err) return callback(err, null);
        return callback(null, times);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };