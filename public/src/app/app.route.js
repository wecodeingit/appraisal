(function() {
        'use strict';


    angular
        .module('appraisal')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home/configuration');
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'src/app/home/home.html',
            })
            .state('home.configuration', {
                url: '/configuration',
                templateUrl: 'src/app/configuration/configuration.html'
            })
            .state('home.score', {
                url: '/score',
                templateUrl: 'src/app/score/score.html'
            })
            .state('home.summary', {
                url: '/summary',
                templateUrl: 'src/app/summary/summary.html'
            });

    }

})();
