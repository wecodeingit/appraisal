(function() {
    'use strict';
    angular
        .module('appraisal')
        .controller('SummaryCtrl', Summary);

    Summary.$inject = ['$timeout', '$scope', '$http'];

    function Summary($timeout, $scope, $http) {
        /*jshint validthis: true */
        var vm = this;
        vm.isDrilldownView = false;
        vm.actionVisible = false;
        vm.title = "View Summary";


        $scope.getOverallScoreForAllEmployees = function() {
            $http({
                method: 'GET',
                url: '/getOverallScoreForAllEmployees'
            }).then(function successCallback(response) {
                vm.employeeList = response.data.score;
            }, function errorCallback(response) {
                console.log("error in save config");
            });
        };

        $scope.empData = ['Employee ID', 'Employee Name', 'Score'];

        $scope.getOverallScoreForAllEmployees();

        vm.nextView = function(employee) {
            $http({
                method: 'GET',
                url: 'getAllIndividualScoreByEmployeeId/' + employee.employeeID
            }).then(function successCallback(response) {
                employee.scores = response.data.score[0].scores;
            }, function errorCallback(response) {
                console.log("error in save config");
            });
            vm.isDrilldownView = true;

            vm.employee = employee;
        };

        $scope.$watch('vm.isDrilldownView', function(isOpen) {
            if (isOpen) {

                vm.actionVisible = vm.isDrilldownView;

                $timeout(function() {

                    vm.tooltipVisible = vm.isDrilldownView;
                }, 1500);

            } else {
                vm.actionVisible = vm.isDrilldownView;
                vm.tooltipVisible = vm.isDrilldownView;
            }
        });


        vm.prevView = function() {
            vm.isDrilldownView = false;
        };
        return vm;
    }

})();
