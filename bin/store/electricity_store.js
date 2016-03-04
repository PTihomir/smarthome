'use strict';
// const sqlite3 = require('sqlite3').verbose();
// const config = require('../config');
// const db = new sqlite3.Database(config.db_name);
const moment = require('moment');
var db = require('../store/database');

function save(data) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO electricity_consumption VALUES ($timestamp, $high_cost, $low_cost)', {
      $timestamp: data.timestamp,
      $high_cost: data.high_cost,
      $low_cost: data.low_cost,
    }, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

function batchSave(dataArray) {
  return new Promise((resolve, reject) => {
    db.parallelize(function () {
      let stmt = db.prepare('INSERT INTO electricity_consumption VALUES ($timestamp, $high_cost, $low_cost)');

      dataArray.forEach((data, index) => {
        stmt.run({
          $timestamp: data.timestamp,
          $high_cost: data.high_cost,
          $low_cost: data.low_cost,
        }, function (err) {
          if (err) {
            console.error(err);
          }
          if (dataArray.length - 1 === index) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        });
      });
      stmt.finalize();
    });
  });
}

function addOrReplace(data) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM electricity_consumption WHERE timestamp IS $timestamp', {
      $timestamp: data.timestamp,
    }, function (err, row) {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        if (row) {
          update(data).then(() => { resolve(); })
            .catch(() => { reject(); });
        } else {
          save(data).then(() => { resolve(); })
            .catch(() => { reject(); });
        }
      }
    });
  });
}

function read(timestamp) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM electricity_consumption WHERE timestamp IS $timestamp', {
      $timestamp: timestamp,
    }, function (err, row) {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve({
          timestamp: row.timestamp,
          high_cost: row.high_cost,
          low_cost: row.low_cost,
        });
      }
    });
  });
}

function readAll() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM electricity_consumption ORDER BY timestamp', function (err, rows) {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function update(data) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE electricity_consumption SET high_cost = $high_cost, low_cost = $low_cost WHERE timestamp = $timestamp', {
      $timestamp: data.timestamp,
      $high_cost: data.high_cost,
      $low_cost: data.low_cost,
    }, function (err) {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function remove(timestamp) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM electricity_consumption WHERE timestamp = $timestamp', {
      $timestamp: timestamp,
    }, function (err) {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// Methods

function getDays(startDate, endDate) {
  const a = moment(startDate);
  const b = moment(endDate);
  let counter = moment(a).startOf('day');
  let result = {};
  let diff;
  let firstTime = moment(a).startOf('day').valueOf();
  let lastTime = moment(b).startOf('day').valueOf();

  // result will contain days
  result[counter.valueOf()] = [16 * 60, 8 * 60];
  while (counter.endOf('day').isBefore(b)) {
    counter.add(1, 'days');
    result[counter.startOf('day').valueOf()] = [16 * 60, 8 * 60];
  }

  diff = moment(a).endOf('day').diff(a, 'minutes') + 1;
  if (diff < 60) {
    result[firstTime][0] = 0;
    result[firstTime][1] = diff;
  } else if (diff < 17 * 60) {
    result[firstTime][0] = diff - 60;
    result[firstTime][1] = 60;
  } else {
    // result[firstTime][0] = 16 * 60;
    result[firstTime][1] = diff - 16 * 60;
  }

  diff = moment(b).endOf('day').diff(b, 'minutes') + 1;

  if (diff < 60) {
    // result[lastTime][0] = 0;
    result[lastTime][1] -= diff;
  } else if (diff < 17 * 60) {
    result[lastTime][0] -= diff - 60;
    result[lastTime][1] -= 60;
  } else {
    result[lastTime][0] -= 16 * 60;
    result[lastTime][1] -= diff - 16 * 60;
  }

  return result;
};

function transpolate(startDate, endDate, highprice, lowprice) {
  let days = getDays(startDate, endDate);
  let sum_day_minutes = 0, sum_night_minutes = 0;
  const timestamps = Object.keys(days);

  // get summs
  timestamps.forEach(timestamp => {
    sum_day_minutes += days[timestamp][0];
    sum_night_minutes += days[timestamp][1];
  });

  // calculate energy consumption
  timestamps.forEach(timestamp => {
    days[timestamp][0] = sum_day_minutes === 0 ? 0 : (highprice * days[timestamp][0]) / sum_day_minutes;
    days[timestamp][1] = sum_night_minutes === 0 ? 0 : (lowprice * days[timestamp][1]) / sum_night_minutes;
  });

  return days;
};

function processElectricity() {
  return readAll()
    .then(function (data) {
      return new Promise((resolve, reject) => {
        let list = {};
        data.forEach((row, index) => {
          if (index === data.length - 1) {
            return;
          }

          const currentDay = row;
          const nextDay = data[index + 1];

          const days = transpolate(currentDay.timestamp, nextDay.timestamp,
            nextDay.high_cost - currentDay.high_cost,
            nextDay.low_cost - currentDay.low_cost);

          Object.keys(days).forEach(key => {
            if (!list[key]) {
              list[key] = days[key];
            } else {
              list[key][0] += days[key][0];
              list[key][1] += days[key][1];
            }
          });
        });

        db.serialize(function () {
          db.run('DELETE FROM electricity_consumption_processed');

          let stmt = db.prepare('INSERT INTO electricity_consumption_processed VALUES ($timestamp, $day, $night)');
          const keys = Object.keys(list);

          keys.forEach((key, index) => {
            stmt.run({
              $timestamp: key,
              $day: list[key][0],
              $night: list[key][1],
            }, function (err) {
              if (err) {
                console.error(err);
              }
              if (keys.length - 1 === index) {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              }
            });
          });
          stmt.finalize();
        });
      });
    });
}

function readProcessed(timestamp) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM electricity_consumption_processed WHERE timestamp = $timestamp', {
      $timestamp: timestamp,
    }, function (err, row) {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function readAllProcessed() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM electricity_consumption_processed ORDER BY timestamp', function (err, rows) {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = {
  save,
  batchSave,
  read,
  addOrReplace,
  update,
  remove,
  getDays,
  transpolate,
  readAll,
  processElectricity,
  readProcessed,
  readAllProcessed,
};
