'use strict';
var url = require('url'),
    fs = require('fs'),
    defaultRawDataFile = __dirname + '/../database/data.csv',
    defaultProcessedDataFile = __dirname + '/../database/processed.csv',
    moment = require('moment'),
    Entry = require('./entry.js');

    require('colors');

function PostServlet(options) {

    var _this = this,
        o = options || {};

    this.options = o;
    // Override default if needed.
    o.raw_file = o.raw_file || defaultRawDataFile;
    o.processed_file = o.processed_file || defaultProcessedDataFile;

    this.raw_entries = null;
    this.entries = null;

    this.handlers = [{
        regexp: /\/electric_submit/i,
        handler: this.saveElectricUpdate
    }, {
        regexp: /\/graph/i,
        handler: this.sendData
    }, {
        regexp: /\/init/i,
        handler: this.sendInit
    }];

    // initialize
    this.readRawData(function () {
        if (_this.raw_entries.length > 1) {
            _this.entries = _this.processData(_this.raw_entries);
            _this.saveProcessedData();
        }
    });
    // this.readProcessedData();

}

PostServlet.prototype.handleRequest = function(req, res) {

    var path = ('./' + req.url.pathname).replace('//','/').replace(/%(..)/g, function(match, hex){
       return String.fromCharCode(parseInt(hex, 16));
    });

    for (var i = 0; i < this.handlers.length; i++) {
        if (this.handlers[i].regexp.test(path)) {
            console.log('Matched: '.green, this.handlers[i].regexp.toString());
            this.handlers[i].handler.call(this, req, res);
            return;
        }
    }

    res.end();
};

PostServlet.prototype.saveElectricUpdate = function(req, res) {

    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    var response = {
        status: true
    };

    var _this = this,
        body = [];

    req.on('data', function (data) {
        body.push(data);

        // Too much POST data, kill the connection!
        if (body.length > 1000)
            req.connection.destroy();
    })
    .on('end', function () {
        var post = JSON.parse(body.join(''));
        var entry = new Entry(post);

        _this.addEntry(entry, function (err) {
            if (err) {
                response.status = false;
            }
            res.write(JSON.stringify(response));
            res.end();

            if (_this.raw_entries.length > 1) {
                _this.entries = _this.processData(_this.raw_entries);
                _this.saveProcessedData();
            }
        });

    });

};

PostServlet.prototype.addEntry = function(entry, callback) {
    var _this = this;

    this.readRawData(function (err, entries) {

        if (err) {
            if (callback) {
                callback(err);
            }
            return;
        }

        entries.push(entry);
        entries.sort(function (a, b) {
            return a.datetime - b.datetime;
        });

        _this.saveRawData(callback);
    });
}


PostServlet.prototype.sendData = function(req, res) {

    this.readProcessedData(function (err, data) {
        if (err) {
            res.writeHead(401);
            res.end();
            return;
        }

        res.write(JSON.stringify(data));
        res.end();
    });
};


// Generate chart data:
//
PostServlet.prototype.processData = function (data) {
    var list = {},
        days,
        entries = [];

    for (var i = 0; i < data.length - 1; i++) {
        days = this.transpolate(data[i].datetime, data[i+1].datetime,
            data[i+1].day_period - data[i].day_period,
            data[i+1].night_period - data[i].night_period);

        for (var day in days) {
            if (!list[day]) {
                list[day] = days[day];
            } else {
                list[day][0] += days[day][0];
                list[day][1] += days[day][1];
            }
        }
    }

    for (var entry in list) {
        entries.push(new Entry({
            datetime: entry,
            day_period: list[entry][0],
            night_period: list[entry][1]
        }));
    }

    return entries;
};

PostServlet.prototype.transpolate = function (startDate, endDate, highprice, lowprice) {
    var days = this.getDays(startDate, endDate),
        day,
        sum_day_minutes = 0, sum_night_minutes = 0;

    // console.log('Transpolate: '.blue, startDate, endDate, highprice, lowprice);
    // console.log('Days: '.red, days);
    for (day in days) {
        sum_day_minutes += days[day][0];
        sum_night_minutes += days[day][1];
    }

    for (day in days) {
        days[day][0] = sum_day_minutes === 0 ? 0 : (highprice * days[day][0]) / sum_day_minutes;
        days[day][1] = sum_night_minutes === 0 ? 0 : (lowprice * days[day][1]) / sum_night_minutes;
    }

    console.log('Days: '.red, days);

    return days;

};

PostServlet.prototype.getDays = function (startDate, endDate) {
    var a = moment(startDate),
        b = moment(endDate),
        counter = moment(a).startOf('day'),
        result = {},
        diff,
        firstTime = moment(a).startOf('day').valueOf(),
        lastTime = moment(b).startOf('day').valueOf();

    result[counter.valueOf()] = [16 * 60, 8 * 60];
    while(counter.endOf('day').isBefore(b)) {
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
        // result[moment(b).startOf('day').valueOf()] = [16 * 60, diff - 16 * 60];
    }

    return result;
};

PostServlet.prototype.sendInit = function(req, res) {

    var response = {
        defaultMailto: config.defaultTo
    };

    response.lastDate = this.docsData.rows[this.docsData.info.lastRow][1];
    response.documentUrl = 'https://docs.google.com/a/alasdoo.com/spreadsheet/ccc?key=0AqXPiPwnV1Y2dFp3RmM1bTdLZTVlcVdvb3pZVEY5cFE&usp=sharing#gid=0';

    res.write(JSON.stringify(response));
    res.end();
};



PostServlet.prototype.saveRawData = function (callback) {

    var data = this.raw_entries.map(function (entry) {
            if (entry) {
                return entry.toCsv();
            }
        }).join('\n');

    fs.writeFile(this.options.raw_file, data, callback);

};

PostServlet.prototype.readRawData = function (callback, force) {

    if (this.raw_entries && !force) {
        callback(undefined, this.raw_entries);
        return;
    }

    var _this = this;

    fs.readFile(this.options.raw_file, 'utf8', function (err, data) {
        if (err) {
            // console.log('Ignore error:'.red, err);
            data = '';
        }

        var lines = data.split('\n'),
            entries = lines.map(function (line) {
                if (line.trim() === '') {
                    return;
                }
                return new Entry(line);
            }).filter(function (entry) {
                return typeof entry !== 'undefined';
            });

        _this.raw_entries = entries;
        callback(undefined, entries);
    });
};


PostServlet.prototype.saveProcessedData = function (callback) {

    var data = this.entries.map(function (entry) {
            if (entry) {
                return entry.toCsv();
            }
        }).join('\n');

    fs.writeFile(this.options.processed_file, data, callback);

};

PostServlet.prototype.readProcessedData = function (callback, force) {

    if (this.entries && !force) {
        callback(undefined, this.entries);
        return;
    }

    var _this = this;
    //     fstat = fs.statSync(this.options.raw_file);

    // if (!fstat.isFile()) {
    //     callback(undefined, []);
    //     return;
    // }

    fs.readFile(this.options.processed_file, 'utf8', function (err, data) {
        if (err) {
            // console.log('Ignore error:'.red, err);
            data = '';
        }

        var lines = data.split('\n'),
            entries = lines.map(function (line) {
                if (line.trim() === '') {
                    return;
                }
                return new Entry(line);
            }).filter(function (entry) {
                return typeof entry !== 'undefined';
            });

        _this.entries = entries;
        callback(undefined, entries);
    });
};


module.exports = PostServlet;
