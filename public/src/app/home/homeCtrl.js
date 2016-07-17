(function() {
    'use strict';


    angular
        .module('appraisal')
        .controller('HomeCtrl', Home);

    Home.$inject = ['$state', '$mdSidenav', '$scope'];


    function Home($state, $mdSidenav, $scope) {
        /*jshint validthis: true */
        var vm = this;
        vm.isSelected = function(route) {
            return $state.includes(route);
        };
        vm.toggleSidenav = function(menuId) {
            $mdSidenav(menuId)
                .toggle();
        };
        vm.closeSidenav = function() {
            $mdSidenav('left')
                .close();
        };
        $scope.$on('$stateChangeSuccess', vm.closeSidenav);
        return vm;
    }

})();
