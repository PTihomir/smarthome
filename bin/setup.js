const database = require('./store/database');
const store = require('./store/electricity_store');
const moment = require('moment');

function main(argv) {
  const shouldReset = argv.indexOf('--reset') > -1;
  const shouldRunDemo = argv.indexOf('--demo') > -1;

  return database[shouldReset ? 'reset' : 'init']().then(() => {
    console.log('Database initialized');

    if (shouldRunDemo) {
      return demo().then(() => {
        console.log('Demo content created');
      });
    }
  });
}

function demo() {
  return store.batchSave([
    { timestamp: 1444769820000, high_cost: 61289, low_cost: 79142 },
    { timestamp: 1444801440000, high_cost: 61290, low_cost: 79158 },
    { timestamp: 1444857180000, high_cost: 61297, low_cost: 79158 },
    { timestamp: 1444885200000, high_cost: 61297, low_cost: 79174 },
    { timestamp: 1445068200000, high_cost: 61316, low_cost: 79207 },
    { timestamp: 1445089500000, high_cost: 61320, low_cost: 79207 },
    { timestamp: 1445284380000, high_cost: 61337, low_cost: 79209 },
    { timestamp: 1445321040000, high_cost: 61337, low_cost: 79235 },
    { timestamp: 1445439420000, high_cost: 61350, low_cost: 79260 },
    { timestamp: 1446136260000, high_cost: 61407, low_cost: 79401 },
    { timestamp: 1446185760000, high_cost: 61409, low_cost: 79423 },
    { timestamp: 1446277320000, high_cost: 61417, low_cost: 79445 },
    { timestamp: 1446321720000, high_cost: 61421, low_cost: 79445 },
    { timestamp: 1446409620000, high_cost: 61429, low_cost: 79470 },
    { timestamp: 1446553320000, high_cost: 61439, low_cost: 79523 },
    { timestamp: 1446651540000, high_cost: 61450, low_cost: 79546 },
    { timestamp: 1446719760000, high_cost: 61452, low_cost: 79568 },
    { timestamp: 1446761820000, high_cost: 61456, low_cost: 79569 },
    { timestamp: 1446788940000, high_cost: 61456, low_cost: 79589 },
    { timestamp: 1447135680000, high_cost: 61474, low_cost: 79702 },
    { timestamp: 1447366140000, high_cost: 61499, low_cost: 79747 },
    { timestamp: 1447452540000, high_cost: 61502, low_cost: 79771 },
    { timestamp: moment([2015, 10, 14, 18, 1]).valueOf(), high_cost: 61509, low_cost: 79785 },
    { timestamp: moment([2015, 10, 15, 13, 12]).valueOf(), high_cost: 61512, low_cost: 79811 },
    { timestamp: moment([2015, 10, 16, 18, 6]).valueOf(), high_cost: 61523, low_cost: 79844 },
    { timestamp: moment([2015, 10, 19, 23, 31]).valueOf(), high_cost: 61541, low_cost: 79898 },
    { timestamp: moment([2015, 10, 20, 9, 16]).valueOf(), high_cost: 61542, low_cost: 79916 },
    { timestamp: moment([2015, 10, 20, 14, 13]).valueOf(), high_cost: 61543, low_cost: 79916 },
    { timestamp: moment([2015, 10, 22, 17, 21]).valueOf(), high_cost: 61555, low_cost: 79959 },
    { timestamp: moment([2015, 10, 23, 16, 29]).valueOf(), high_cost: 61559, low_cost: 79983 },
    { timestamp: moment([2015, 10, 24, 9, 41]).valueOf(), high_cost: 61563, low_cost: 80008 },
    { timestamp: moment([2015, 10, 25, 12, 24]).valueOf(), high_cost: 61574, low_cost: 80034 },
    { timestamp: moment([2015, 10, 25, 20, 18]).valueOf(), high_cost: 61576, low_cost: 80034 },
    { timestamp: moment([2015, 10, 30, 17, 29]).valueOf(), high_cost: 61604, low_cost: 80185 },
    { timestamp: moment([2015, 11, 2, 8, 0]).valueOf(), high_cost: 61618, low_cost: 80256 },
    { timestamp: moment([2015, 11, 2, 20, 51]).valueOf(), high_cost: 61622, low_cost: 80256 },
    { timestamp: moment([2015, 11, 3, 9, 13]).valueOf(), high_cost: 61624, low_cost: 80290 },
    { timestamp: moment([2015, 11, 4, 8, 35]).valueOf(), high_cost: 61631, low_cost: 80322 },
    { timestamp: moment([2015, 11, 7, 9, 1]).valueOf(), high_cost: 61652, low_cost: 80368 },
    { timestamp: moment([2015, 11, 7, 21, 29]).valueOf(), high_cost: 61682, low_cost: 80368 },
    { timestamp: moment([2015, 11, 8, 8, 15]).valueOf(), high_cost: 61683, low_cost: 80411 },
    { timestamp: moment([2015, 11, 8, 23, 50]).valueOf(), high_cost: 61686, low_cost: 80414 },
    { timestamp: moment([2015, 11, 14, 9, 31]).valueOf(), high_cost: 61712, low_cost: 80636 },
    { timestamp: moment([2015, 11, 14, 9, 31]).valueOf(), high_cost: 61712, low_cost: 80636 },
    { timestamp: moment([2015, 11, 16, 19, 24]).valueOf(), high_cost: 61727, low_cost: 80706 },
    { timestamp: moment([2015, 11, 25, 11, 3]).valueOf(), high_cost: 61779, low_cost: 81033 },
    { timestamp: moment([2015, 11, 27, 10, 21]).valueOf(), high_cost: 61794, low_cost: 81110 },
    { timestamp: moment([2016, 0, 9, 1, 9]).valueOf(), high_cost: 61877, low_cost: 81614 },
    { timestamp: moment([2016, 0, 10, 16, 15]).valueOf(), high_cost: 61887, low_cost: 81697 },
    { timestamp: moment([2016, 0, 11, 19, 54]).valueOf(), high_cost: 61893, low_cost: 81741 },
    { timestamp: moment([2016, 0, 18, 17, 18]).valueOf(), high_cost: 61944, low_cost: 81991 },
    { timestamp: moment([2016, 0, 23, 17, 16]).valueOf(), high_cost: 61980, low_cost: 82154 },
    { timestamp: moment([2016, 0, 30, 16, 27]).valueOf(), high_cost: 62025, low_cost: 82392 },
    { timestamp: moment([2016, 1, 2, 19, 39]).valueOf(), high_cost: 62042, low_cost: 82481 },
    { timestamp: moment([2016, 1, 8, 9, 40]).valueOf(), high_cost: 62078, low_cost: 82656 },
    { timestamp: moment([2016, 1, 9, 8, 25]).valueOf(), high_cost: 62086, low_cost: 82687 },
    { timestamp: moment([2016, 1, 10, 17, 26]).valueOf(), high_cost: 62097, low_cost: 82714 },
    { timestamp: moment([2016, 1, 11, 9, 49]).valueOf(), high_cost: 62100, low_cost: 82743 },
  ])
  .then(() => {
    return store.processElectricity();
  })
  .catch((err) => {
    console.error(err);
  });
}

// Must be last,
main(process.argv);
