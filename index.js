const { nextISSTimesForMyLocation } = require('./iss');

nextISSTimesForMyLocation((err, passTimes) => {
  if (err) {
    console.log('It didn\'t work!');
    return console.log(err);
  }
  // success
  for (passTime of passTimes) {
    console.log(`Next pass at ${Date(passTime.risetime)} for ${passTime.duration} seconds!`);
  }
});