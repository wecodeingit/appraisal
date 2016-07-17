(function() {
    'use strict';

    var modules = ['ngAria', 'ngAnimate', 'ngMaterial', 'ui.router', 'templates'].filter(function(module) {
        try {
            return !!angular.module(module);
        } catch (e) {}
    });

    angular.module('appraisal', modules);



})();
