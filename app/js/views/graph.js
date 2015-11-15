(function (Ember, Smarthome, undefined) {
    'use strict';
    Smarthome.LinechartView = Ember.View.extend({
        tagName: 'div',
        template: Ember.Handlebars.compile('<svg class="" width="1000" height="500">'),
        // layout: Ember.Handlebars.compile('{{yield}}<span class="input-group-addon"><i class="glyphicon glyphicon-time"></i></span>'),
        classNames: ['d3-graph'],

        didInsertElement: function () {
            this._init();


            // this.$().find('input').timepicker({
            //     showMeridian: false,
            //     defaultTime: false
            // })
            // .on('changeTime.timepicker', function(e){
            //     _this.set('value', moment.utc().hours(e.time.hours).minutes(e.time.minutes).format('HH:mm'));
            // })
            // .timepicker('setTime', this.get('value') || moment().format('HH:mm'));
        },

        willDestroyElement: function(){
            // do cleanup if needed
            this._super();

        },

        _init: function () {
            var WIDTH = 1000,
                HEIGHT = 500,
                MARGINS = {
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 50
                },

                chart = this.chart = d3.select('#'+this.elementId).select('svg'),

                xRange = this.xRange = d3.scale
                    .linear()
                    .range([MARGINS.left, WIDTH - MARGINS.right]),
                    // .domain([
                    //     d3.min(lineData, function(d) {
                    //         return d.x;
                    //     }),
                    //     d3.max(lineData, function(d) {
                    //         return d.x;
                    //     })
                    // ]);
                yRange = this.yRange = d3.scale
                    .linear()
                    .range([HEIGHT - MARGINS.top, MARGINS.bottom]),
                    // .domain([
                    //     d3.min(lineData, function(d) {
                    //         return d.y;
                    //     }),
                    //     d3.max(lineData, function(d) {
                    //         return d.y;
                    //     })
                    // ]);
                xAxis = this.xAxis = d3.svg.axis()
                    .scale(xRange)
                    .tickSize(5)
                    .tickSubdivide(true),

                yAxis = this.yAxis = d3.svg.axis()
                    .scale(yRange)
                    .tickSize(5)
                    .orient('left')
                    .tickSubdivide(true);

            chart.append('svg:g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')');

            chart.append('svg:g')
                .attr('class', 'y axis')
                .attr('transform', 'translate(' + (MARGINS.left) + ',0)');
        },

        _render: function () {

            var chart = this.chart,
                lineData = this.get('value'),
                xRange = this.xRange,
                yRange = this.yRange;

            console.log('Ping', lineData);

            this.xRange.domain([
                d3.min(lineData, function(d) {
                    return d.datetime;
                }),
                d3.max(lineData, function(d) {
                    return d.datetime;
                })
            ]);

            this.yRange.domain([
                d3.min(lineData, function(d) {
                    return Math.min(d.day_period, d.night_period);
                }),
                d3.max(lineData, function(d) {
                    return Math.max(d.day_period, d.night_period);
                })
            ]);

            chart.select('.x.axis')
                .call(this.xAxis);

            chart.select('.y.axis')
                .call(this.yAxis);

            var lineFunc = d3.svg.line()
                    .x(function(d) {
                        return xRange(d.datetime);
                    })
                    .y(function(d) {
                        return yRange(d.day_period);
                    })
                    .interpolate('linear'),
                lineFuncNight = d3.svg.line()
                    .x(function(d) {
                        return xRange(d.datetime);
                    })
                    .y(function(d) {
                        return yRange(d.night_period);
                    })
                    .interpolate('linear');

            chart.append('svg:path')
                .attr('d', lineFunc(lineData))
                .attr('stroke', 'yellow')
                .attr('stroke-width', 2)
                .attr('fill', 'none');

            chart.append('svg:path')
                .attr('d', lineFuncNight(lineData))
                .attr('stroke', 'blue')
                .attr('stroke-width', 2)
                .attr('fill', 'none');

        }.observes('value')
        // },

        // _updateDateWidget: function () {
        //     Ember.$(this.element).datepicker('update', moment(this.get('value')).toDate());
        // }.observes('value')
    });
}(window.Ember, window.Smarthome));
