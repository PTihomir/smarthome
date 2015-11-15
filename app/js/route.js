(function (Ember, Smarthome, undefined) {
    'use strict';
    // App route
    Smarthome.Router.map(function() {

    });

    Smarthome.IndexRoute = Ember.Route.extend({
        setupController: function(controller, model) {
            this._super(controller, model);
        },

        model: function () {
            window._model = Ember.Object.create();

            return window._model;
        },

        init: function () {

        }
    });



} (window.Ember, window.Smarthome));
