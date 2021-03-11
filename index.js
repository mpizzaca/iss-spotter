const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss');

// fetchMyIP((err, body) => {
//   if (err) {
//     console.log('Error:', err);
//     return;
//   }
//   console.log(body);
// });

// fetchCoordsByIP('23.233.65.73', (err, data) => {
//   console.log('err:', err);
//   console.log('data:', data);
// });

// const exampleCoords = {
//   latitude: 43.6644,
//   longitude: -79.4195
// };
// fetchISSFlyOverTimes(exampleCoords, (err, data) => {
//   console.log('err:', err);
//   console.log('data:', data);
// });