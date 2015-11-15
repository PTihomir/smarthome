(function (Ember, Smarthome, undefined) {
    'use strict';
    Smarthome.TimepickerView = Ember.View.extend({
        tagName: 'div',
        template: Ember.Handlebars.compile('<input class="form-control input-small">'),
        layout: Ember.Handlebars.compile('{{yield}}<span class="input-group-addon"><i class="glyphicon glyphicon-time"></i></span>'),
        attributeBindings: ['disabled', 'type', 'placeholder'],
        classNames: ['input-group', 'bootstrap-timepicker', 'timepicker'],
        type: 'text',
        disabled: false,
        placeholder: 'Insert time',

        didInsertElement: function () {
            var _this = this;

            this.$().find('input').timepicker({
                showMeridian: false,
                defaultTime: false
            })
            .on('changeTime.timepicker', function(e){
                _this.set('value', moment.utc().hours(e.time.hours).minutes(e.time.minutes).format('HH:mm'));
            })
            .timepicker('setTime', this.get('value') || moment().format('HH:mm'));
        },

        willDestroyElement: function(){
            // do cleanup if needed
            this._super();

            this.$().off('.timepicker');
        }
        // },

        // _updateDateWidget: function () {
        //     Ember.$(this.element).datepicker('update', moment(this.get('value')).toDate());
        // }.observes('value')
    });
}(window.Ember, window.Smarthome));
