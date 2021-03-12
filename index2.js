const { nextISSTimesForMyLocation } = require('./iss_promised');

const printPassTimes = passTimes => {
  for (let passTime of passTimes) {
    console.log(`Next pass at ${new Date(passTime.risetime * 1000)} for ${passTime.duration} seconds!`);
  }
};

nextISSTimesForMyLocation()
  .then(printPassTimes)
  .catch(err => {
    console.log('Something went wrong!');
    console.log(err);
  });