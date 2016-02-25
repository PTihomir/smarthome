var sqlite3 = require('sqlite3').verbose();
var config = require('../config');
var database = new sqlite3.Database(config.db_name);

function init_database() {
  return new Promise((resolve, reject) => {
    database.serialize(function () {
      database.run(`CREATE TABLE if not exists electricity_consumption
                    (timestamp INTEGER UNIQUE, high_cost INTEGER, low_cost INTEGER)`,
                    (err) => { if (err) reject(err); });

      database.run(`CREATE TABLE if not exists electricity_consumption_processed
                    (timestamp INTEGER UNIQUE, day INTEGER, night INTEGER)`,
                    (err) => { if (err) reject(err); });

      database.run(`CREATE TABLE if not exists fuel_consumption
                    (timestamp INTEGER UNIQUE, fuel REAL, distance REAL, cost REAL, lit_hundred REAL, cost_hundred REAL, note TEXT)`,
                    (err) => { if (err) reject(err); });

      database.run(`CREATE TABLE if not exists temperature_logging
                    (timestamp INTEGER UNIQUE, device_id INTEGER, humidity REAL, temperature REAL )`,
        (err) => {
          // Last table created
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });

      // var stmt = database.prepare('INSERT INTO user_info VALUES (?)');
      // for (var i = 0; i < 10; i++) {
      //   stmt.run('Ipsum ' + i);
      // }
      // stmt.finalize();

      // database.each('SELECT rowid AS id, info FROM user_info', (err, row) => {
      //   if (err) {
      //     console.log(`Error ${err}`);
      //   }
      //   console.log(`${row.id}:${row.info}`);
      // });
    });
  });
};

function reset_database() {
  return new Promise((resolve, reject) => {
    database.serialize(function () {
      database.run('DROP TABLE if exists electricity_consumption');
      database.run('DROP TABLE if exists electricity_consumption_processed');

      database.run('DROP TABLE if exists fuel_consumption');
      database.run('DROP TABLE if exists temperature_logging');

      init_database()
        .then(() => { resolve(); })
        .catch(() => { reject(); });
    });
  });
};

module.exports = database;
module.exports.reset = reset_database;
module.exports.init = init_database;
module.exports.close = function () { database.close(); };
