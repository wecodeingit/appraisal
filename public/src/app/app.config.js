(function() {
    'use strict';


    angular
        .module('appraisal')
        .config(configure);

    configure.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider'];

    function configure($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

        $locationProvider.hashPrefix('!');

        // This is required for Browser Sync to work poperly
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

        //Global HTTP error handler
        var interceptor = ['$q', '$injector', function($q, $injector) {
            function showMessage(text) {
                var $mdToast = $injector.get('$mdToast');
                $mdToast.show($mdToast.simple()
                    .textContent(text)
                    .position("top right"));
            }
            return {
                responseError: function(error) {
                    showMessage('Network Error');
                    return $q.reject(error);
                }
            };

        }];

        $httpProvider.interceptors.push(interceptor);

    }




})();
