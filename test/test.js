var should = require('should'),
    moment = require('moment'),
    fs = require('fs'),
    Entry = require('../bin/entry.js'),
    post_servlet = require('../bin/post_servlet.js');



describe('Post servlet', function() {
    describe('transpolate', function () {
        beforeEach(function instanceServlet() {
            this.servlet = new post_servlet({
                raw_file: __dirname + '/../database/test-data.csv',
                processed_file: __dirname + '/../database/test-processed.csv'
            });
        });

        it('should return correct high value for ideal situation', function () {

            var servlet = this.servlet,
                a = moment([2015, 11, 1, 00, 00]),
                b = moment([2015, 11, 2, 00, 00]),
                days = servlet.transpolate(a.valueOf(), b.valueOf(), 16, 8);

            days.should.have.property(a.valueOf(), [16, 8]);
            days.should.have.property(b.valueOf(), [0, 0]);
        });

        it('should return correct high value for more day', function () {

            var servlet = this.servlet,
                a = moment([2015, 11, 1, 00, 00]),
                firstDay = moment(a).startOf('day'),
                b = moment([2015, 11, 4, 07, 00]),
                days = servlet.transpolate(a.valueOf(), b.valueOf(), 48, 31);

            days.should.have.property(firstDay.valueOf(), [16, 8]);
            days.should.have.property(firstDay.add(1, 'days').valueOf(), [16, 8]);
            days.should.have.property(firstDay.add(1, 'days').valueOf(), [16, 8]);
            days.should.have.property(firstDay.add(1, 'days').valueOf(), [0, 7]);
        });

        it('should return correct high value for complicated', function () {

            var servlet = this.servlet,
                a = moment([2015, 11, 4, 04, 00]),
                firstDay = moment(a).startOf('day'),
                b = moment([2015, 11, 7, 04, 00]),
                days = servlet.transpolate(a.valueOf(), b.valueOf(), 24, 48);

            days.should.have.property(firstDay.valueOf(), [8, 8]);
            days.should.have.property(firstDay.add(1, 'days').valueOf(), [8, 16]);
            days.should.have.property(firstDay.add(1, 'days').valueOf(), [8, 16]);
            days.should.have.property(firstDay.add(1, 'days').valueOf(), [0, 8]);
        });

    });

    describe('getDays', function () {
        beforeEach(function instanceServlet() {
            this.servlet = new post_servlet({
                raw_file: __dirname + '/../database/test-data.csv',
                processed_file: __dirname + '/../database/test-processed.csv'
            });
        });

        it('should return one day', function () {

            var servlet = this.servlet,
                a = moment([2015, 11, 1, 00, 00]),
                b = moment([2015, 11, 1, 18, 00]),
                result = servlet.getDays(a, b);

            result.should.have.property(a.valueOf(), [11 * 60, 7 * 60]);
        });
        it('should return two day', function () {

            var servlet = this.servlet,
                a = moment([2015, 11, 1, 00, 00]),
                b = moment([2015, 11, 2, 18, 00]),
                result = servlet.getDays(a, b);

            result.should.have.property(a.valueOf(), [16 * 60, 8 * 60]);
            result.should.have.property(b.startOf('day').valueOf(), [11 * 60, 7 * 60]);
        });
        it('should return four day', function () {

            var servlet = this.servlet,
                a = moment([2015, 11, 1, 00, 00]),
                b = moment([2015, 11, 4, 00, 00]),
                result = servlet.getDays(a, b);

            result.should.have.property(a.valueOf(), [16 * 60, 8 * 60]);
            result.should.have.property(a.add(1, 'days').valueOf(), [16 * 60, 8 * 60]);
            result.should.have.property(a.add(1, 'days').valueOf(), [16 * 60, 8 * 60]);
            result.should.have.property(b.valueOf(), [0 * 60, 0 * 60]);
        });
        it('should return 2 day with correct value', function () {

            var servlet = this.servlet,
                a, b, result;

            a = moment([2015, 11, 1, 15, 00]);
            b = moment([2015, 11, 2, 18, 00]);
            result = servlet.getDays(a, b);
            result.should.have.property(a.startOf('day').valueOf(), [8 * 60, 1 * 60]);
            result.should.have.property(b.startOf('day').valueOf(), [11 * 60, 7 * 60]);

            a = moment([2015, 11, 1, 5, 00]);
            b = moment([2015, 11, 2, 5, 00]);
            result = servlet.getDays(a, b);
            result.should.have.property(a.startOf('day').valueOf(), [16 * 60, 3 * 60]);
            result.should.have.property(b.startOf('day').valueOf(), [0, 5 * 60]);

            a = moment([2015, 11, 1, 10, 00]);
            b = moment([2015, 11, 2, 10, 00]);
            result = servlet.getDays(a, b);
            result.should.have.property(a.startOf('day').valueOf(), [13 * 60, 1 * 60]);
            result.should.have.property(b.startOf('day').valueOf(), [3 * 60, 7 * 60]);

            a = moment([2015, 11, 1, 23, 30]);
            b = moment([2015, 11, 2, 23, 45]);
            result = servlet.getDays(a, b);
            result.should.have.property(a.startOf('day').valueOf(), [0, 30]);
            result.should.have.property(b.startOf('day').valueOf(), [16 * 60, 7 * 60 + 45]);

        });
    });

    describe('processData', function () {
        beforeEach(function instanceServlet() {
            this.servlet = new post_servlet({
                raw_file: __dirname + '/../database/test-data.csv',
                processed_file: __dirname + '/../database/test-processed.csv'
            });
        });

        it('process', function () {

            var servlet = this.servlet,
                a = moment([2015, 11, 1, 00, 00]).valueOf(),
                b = moment([2015, 11, 2, 00, 00]).valueOf(),
                list = [
                    new Entry({datetime: a, day_period: 16, night_period: 8}),
                    new Entry({datetime: b, day_period: 16, night_period: 8})
                ],
                result = servlet.processData(list);

            result[0].should.have.properties({
                datetime: a,
                day_period: 0,
                night_period: 0
            });

            result[1].should.have.properties({
                datetime: b,
                day_period: 0,
                night_period: 0
            });
        });
        it('process', function () {

            var servlet = this.servlet,
                a = moment([2015, 11, 1, 00, 00]).valueOf(),
                b = moment([2015, 11, 2, 00, 00]).valueOf(),
                list = [
                    new Entry({datetime: a, day_period: 16, night_period: 8}),
                    new Entry({datetime: b, day_period: 32, night_period: 16})
                ],
                result = servlet.processData(list);

            result[0].should.have.properties({
                datetime: a,
                day_period: 16,
                night_period: 8
            });

            result[1].should.have.properties({
                datetime: b,
                day_period: 0,
                night_period: 0
            });
        });
    });


    describe('fileOperations', function () {
        beforeEach(function instanceServlet() {
            this.servlet = new post_servlet({
                raw_file: __dirname + '/../database/test-data.csv',
                processed_file: __dirname + '/../database/test-processed.csv'
            });
        });

        afterEach(function removeFiles() {
            try {
                fs.unlinkSync(this.servlet.options.raw_file);
            } catch (e) {

            }

            try {
                fs.unlinkSync(this.servlet.options.processed_file);
            } catch (e) {

            }
        });

        it('should write and read raw data', function (done) {
            var _this = this,
                servlet = this.servlet,
                entry = new Entry('111,1,2');

            this.servlet.addEntry(entry, function () {
                servlet.raw_entries.should.have.length(1);
                servlet.raw_entries[0].should.have.property('datetime', 111);
                done();
            });
        });

        it('should write and read 3 data, check sort', function (done) {
            var _this = this,
                servlet = this.servlet,
                entry1 = new Entry('111,3,5'),
                entry2 = new Entry('222,8,10'),
                entry3 = new Entry('100,1,1');

            servlet.addEntry(entry1, function () {
                servlet.raw_entries.should.have.length(1);
                servlet.raw_entries[0].should.have.property('datetime', entry1.datetime);

                servlet.addEntry(entry2, function () {
                    servlet.raw_entries.should.have.length(2);
                    servlet.raw_entries[0].should.have.property('datetime', entry1.datetime);
                    servlet.raw_entries[1].should.have.property('datetime', entry2.datetime);

                    servlet.addEntry(entry3, function () {

                        servlet.readRawData(function () {
                            servlet.raw_entries.should.have.length(3);
                            servlet.raw_entries[0]
                                .should.have
                                    .properties({
                                        datetime: entry3.datetime,
                                        day_period: entry3.day_period,
                                        night_period: entry3.night_period
                                    });

                            servlet.raw_entries[1].should.have.property('datetime', entry1.datetime);

                            done();
                        }, true);

                    });
                })

            });
        });

        it('should write and read raw data', function (done) {
            var _this = this,
                servlet = this.servlet,
                entry1 = new Entry('111,1,2');
                entry2 = new Entry('222,2,4');

            servlet.entries = [entry1, entry2];
            servlet.saveProcessedData(function () {
                servlet.readProcessedData(function () {
                    servlet.entries[0]
                        .should.have.properties({
                            datetime: entry1.datetime,
                            day_period: entry1.day_period,
                            night_period: entry1.night_period
                        });
                        done();
                }, true);
            })

        });
    });
});
