(function (Ember, Smarthome, $, undefined) {
    'use strict';

    Smarthome.IndexController = Ember.ObjectController.extend({
        actions: {
            saveElectricity: function () {
                var _this = this,
                    model = this.get('model'),
                    data = model.getProperties(['date', 'time', 'day_period', 'night_period']),
                    date = moment(data.date, 'YYYY.MM.DD.'),
                    time = moment(data.time, 'HH:mm');

                data.datetime = date.hours(time.hours()).minutes(time.minutes());

                console.log(data);

                this.showMessage('Sending data...');

                $.ajax('electric_submit', {
                    type: 'POST',
                    dataType: 'json',
                    data: JSON.stringify({
                        datetime: data.datetime.valueOf(),
                        day_period: data.day_period,
                        night_period: data.night_period
                    })
                })
                .done(function (data) {
                    if (data.status) {
                        _this.showMessage('Sending OK');
                    } else {
                        _this.showMessage('Sending FAILED');
                    }
                })
                .fail(function () {
                    _this.showMessage('Server error...');
                });
            },

            fetchElectricity: function (report) {
                this.getGraphData();
            }
        },

        clearMessage: function () {
            this.set('model.message', null);
        },

        showMessage: function (message) {
            this.set('model.message', message);
        },

        getGraphData: function () {
            var _this = this;

            $.ajax('graph', {
                type: 'POST',
                dataType: 'json',
                cache: false,
            })
            .done(function (data) {
                console.log(data);
                _this.set('model.graph', data);
            })
            .fail(function () {
                // _this.setServerResponse('Server communication error\t' + moment().format('H:mm:ss'), true);
            });
        },

        init: function () {
            var _this = this;
        }

    });

} (window.Ember, window.Smarthome, window.jQuery));
