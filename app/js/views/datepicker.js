(function (Ember, Smarthome, undefined) {
    'use strict';

    Smarthome.DatepickerView = Ember.TextField.extend({
        tagName: 'input',
        attributeBindings: ['disabled', 'type', 'placeholder'],
        type: 'text',
        disabled: false,
        placeholder: 'Insert date',

        didInsertElement: function () {
            var _this = this;

            this.$().datepicker({
                autoclose: true,
                weekStart: 1,
                format: 'yyyy.mm.dd.'
            })
            .on('changeDate', function(e){
                _this.set('value', moment(e.date).toJSON());
            })
            .datepicker('update', moment(this.get('value') || new Date()).toDate());
        },

        willDestroyElement: function(){
            // do cleanup if needed
            this._super();

            this.$().off('changeDate');

        },

        _updateDateWidget: function () {
            Ember.$(this.element).datepicker('update', moment(this.get('value')).toDate());
        }.observes('value')
    });
}(window.Ember, window.Smarthome));
