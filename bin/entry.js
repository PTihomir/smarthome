function Entry(obj) {
    if (typeof obj === 'string') {
        this.fromCsv(obj);
    } else if (typeof obj === 'object') {
        this.datetime = parseInt(obj.datetime);
        this.day_period = parseFloat(obj.day_period);
        this.night_period = parseFloat(obj.night_period);
    }
}

Entry.prototype.fromCsv = function (csvLine) {
    var values = csvLine.split(',');
    this.datetime = parseInt(values[0]);
    this.day_period = parseFloat(values[1]);
    this.night_period = parseFloat(values[2]);
    return this;
}

Entry.prototype.toCsv = function (csvLine) {
    return this.datetime + ',' + this.day_period + ',' + this.night_period;
}

module.exports = Entry;
