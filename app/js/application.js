(function (Ember, undefined) {
    'use strict';

    var Smarthome = window.Smarthome = Ember.Application.create({
        LOG_TRANSITIONS: true,
        LOG_TRANSITIONS_INTERNAL: false,
        LOG_VIEW_LOOKUPS: false,
        LOG_ACTIVE_GENERATION: true,
        LOG_RESOLVER: false

    });

    Smarthome.ApplicationRoute = Ember.Route.extend({
        setupController: function(/*controller*/) {
        }
    });

    Smarthome.ApplicationController = Ember.Controller.extend({

    });

}(window.Ember));
