/* global describe, beforeEach, it */
var should = require('should'); // eslint-disable-line no-unused-vars
var moment = require('moment');
var database = require('../bin_app/store/database');
var electricityStore = require('../bin_app/store/electricity_store');

describe('Check CRUD operations on electricity store', function () {
  describe('Test getDays', function () {
    it('transpolate', function () {
      const a = moment([2015, 11, 4, 4, 0]);
      const b = moment([2015, 11, 7, 4, 0]);
      const firstDay = moment(a).startOf('day');
      const days = electricityStore.getDays(a.valueOf(), b.valueOf());

      days.should.have.property(firstDay.valueOf(), [960, 240]);
      days.should.have.property(firstDay.add(1, 'days').valueOf(), [960, 480]);
      days.should.have.property(firstDay.add(1, 'days').valueOf(), [960, 480]);
      days.should.have.property(firstDay.add(1, 'days').valueOf(), [0, 240]);
    });
  });

  describe('Test transpolate', function () {
    it('transpolate', function () {
      const a = moment([2015, 11, 4, 4, 0]);
      const firstDay = moment(a).startOf('day');
      const b = moment([2015, 11, 7, 4, 0]);
      const days = electricityStore.transpolate(a.valueOf(), b.valueOf(), 24, 48);

      days.should.have.property(firstDay.valueOf(), [8, 8]);
      days.should.have.property(firstDay.add(1, 'days').valueOf(), [8, 16]);
      days.should.have.property(firstDay.add(1, 'days').valueOf(), [8, 16]);
      days.should.have.property(firstDay.add(1, 'days').valueOf(), [0, 8]);
    });
  });

  describe('Create/Read operation', function () {
    beforeEach(function (done) {
      database.reset().then(() => { done(); });
    });

    it('Add entry', function () {
      const a = moment([2015, 11, 1, 0, 0]);
      const object = {
        timestamp: a.valueOf(),
        high_cost: 16,
        low_cost: 8,
      };

      electricityStore.save(object)
        .then(() => {
          return electricityStore.read(a.valueOf());
        })
        .should.be.eventually.deepEqual(object);
    });

    it('should return correct high value for more day', function (done) {
      var a = moment([2015, 11, 3, 9, 0]),
        firstDay = moment(a).startOf('day'),
        b = moment([2015, 11, 3, 15, 0]);

      electricityStore.save({timestamp: a.valueOf(), high_cost: 10, low_cost: 10}).then(() => {
        electricityStore.save({timestamp: b.valueOf(), high_cost: 28, low_cost: 10})
          .then(() => {
            electricityStore.processElectricity()
              .then(function () {
                return electricityStore.readProcessed(firstDay.valueOf());
              })
              .then(function (row) {
                row.should.deepEqual({
                  timestamp: firstDay.valueOf(),
                  day: 18,
                  night: 0,
                });
                done();
              });
          });
      });
    });

    it('should return correct high value for more day', function (done) {
      var a = moment([2015, 11, 3, 9, 0]),
        firstDay = moment(a).startOf('day'),
        b = moment([2015, 11, 3, 23, 35]);

      electricityStore.save({timestamp: a.valueOf(), high_cost: 10, low_cost: 10}).then(() => {
        electricityStore.save({timestamp: b.valueOf(), high_cost: 28, low_cost: 12})
          .then(() => {
            electricityStore.processElectricity()
              .then(function () {
                return electricityStore.readProcessed(firstDay.valueOf());
              })
              .then(function (row) {
                row.should.deepEqual({
                  timestamp: firstDay.valueOf(),
                  day: 18,
                  night: 2,
                });
                done();
              });
          });
      });
    });

    it('should return correct high value for more day', function (done) {
      var a = moment([2015, 11, 1, 0, 0]),
        firstDay = moment(a).startOf('day'),
        b = moment([2015, 11, 4, 7, 0]),
        c = moment([2015, 11, 5, 21, 0]);

      electricityStore.save({timestamp: a.valueOf(), high_cost: 6, low_cost: 0})
        .then(() => {
          return electricityStore.save({timestamp: b.valueOf(), high_cost: 45, low_cost: 31});
        })
        .then(() => {
          return electricityStore.save({timestamp: c.valueOf(), high_cost: 60, low_cost: 47});
        })
        .then(() => {
          return electricityStore.processElectricity();
        })
        .then(function () {
          return electricityStore.readAllProcessed();
        })
        .then(function (rows) {
          rows.should.have.length(5);
          rows[0].should.deepEqual({
            timestamp: firstDay.valueOf(),
            day: 13,
            night: 8,
          });
          rows[1].should.be.deepEqual({
            timestamp: firstDay.add(1, 'days').valueOf(),
            day: 13,
            night: 8,
          });
          rows[2].should.be.deepEqual({
            timestamp: firstDay.add(1, 'days').valueOf(),
            day: 13,
            night: 8,
          });
          rows[3].should.be.deepEqual({
            timestamp: firstDay.add(1, 'days').valueOf(),
            day: 8,
            night: 9,
          });
          rows[4].should.be.deepEqual({
            timestamp: firstDay.add(1, 'days').valueOf(),
            day: 7,
            night: 14,
          });
          done();
        })
        .catch((err) => { console.error(err); });
    });
  });
});
