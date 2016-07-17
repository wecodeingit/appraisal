(function() {
    'use strict';



    angular
        .module('appraisal')
        .controller('ConfigurationCtrl', ConfigurationCtrl);

    ConfigurationCtrl.$inject = ['$scope', '$mdDialog', '$http', '$mdToast', '$state'];

    function ConfigurationCtrl($scope, $mdDialog, $http, $mdToast, $state) {
        /*jshint validthis: true */
        var vm = this;
        vm.title = "Create Configuration";
        $scope.section = [{
            sectionName: '',
            sectionWeightage: ''
        }];
        $scope.sectionWeightage = [];
        $scope.number = 1;
        $scope.getNumber = function(num) {
            return new Array(num);
        };

        $scope.addNewSection = function() {
            $scope.number = $scope.number + 1;
        };

        $scope.removeCurrentSection = function($index) {
            $scope.section.splice($index, 1);
            $scope.number = $scope.number - 1;
        };

        $scope.sumInputScore = function() {
            var total = 0;
            angular.forEach($scope.section, function(value, key) {
                total += parseFloat(value.sectionWeightage);
            });

            return total;
        };
        $scope.saveSectionData = function() {
            if ($scope.sumInputScore() !== 100) {
                $scope.showAlert({
                    title: 'Invalid',
                    message: "Sum of all sections should be equal to 100",
                    action: 'OK'
                });
            } else {
                $http({
                    method: 'POST',
                    data: {
                        'section': $scope.section
                    },
                    url: '/saveSectionConfiguration'
                }).then(function successCallback(response) {
                    $mdToast.show($mdToast.simple()
                        .textContent('Saved successfully')
                        .position("top right"));
                    console.log("configuration saved successfully");
                }, function errorCallback(response) {
                    console.log("error in save config");
                });

            }
        };
        $scope.showAlert = function(params) {
            var alert = $mdDialog.alert()
                .clickOutsideToClose(true)
                .title(params.title)
                .textContent(params.message)
                .ariaLabel(params.title)
                .ok(params.action);
            $mdDialog.show(alert);
        };

    }

})();
