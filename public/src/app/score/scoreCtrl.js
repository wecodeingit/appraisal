(function() {
    'use strict';

    angular
        .module('appraisal')
        .controller('ScoreCtrl', Score);

    Score.$inject = ['$scope', '$mdBottomSheet', '$http', '$mdDialog'];

    function Score($scope, $mdBottomSheet, $http, $mdDialog) {
        /*jshint validthis: true */
        var vm = this;
        vm.title = "Enter Score";



        $scope.getEmployeeData = function() {
            $http({
                method: 'GET',
                url: '/getAllEmployees'
            }).then(function successCallback(response) {
                vm.employeeData = response.data.employee;
                $http({
                    method: 'GET',
                    url: '/getSectionConfiguration'
                }).then(function successCallback(response) {
                    vm.measureData = response.data.section;
					console.log("check git");
                }, function errorCallback(response) {
                    console.log("error in save config");
                });
            }, function errorCallback(response) {
                console.log("error in save config");
            });
        };

        $scope.getEmployeeData();
        vm.scoreData = [];
        vm.enterScore = false;
        vm.selectedItemChange = function(item) {
            $scope.id = item.id;
            if (item) {
                vm.enterScore = true;
            } else {
                vm.enterScore = false;
            }
        };

        vm.querySearch = function(query) {
            return query ? vm.employeeData.filter(createFilterFor(query)) : vm.employeeData;
        };
        vm.calculateScore = function() {
            var overallScore = 0;
            var index = 0;
            var scoreData = [];

            if (vm.scoreData.length !== vm.measureData.length) {
                $scope.showAlert();
            } else {
                angular.forEach(vm.measureData, function(value, key) {
                    scoreData.push({ "score_id": value.id, "score_value": vm.scoreData[index] });
                    overallScore = parseFloat(overallScore) + parseFloat((value.weightage * vm.scoreData[index]));
                    index++;
                });

                var overallScoreVal = (overallScore / 100) * vm.measureData.length;

                var scoreJson = {
                    "employeeID": $scope.id,
                    "overallScore": overallScoreVal,
                    "individualScore": scoreData
                };
                $http({
                    method: 'POST',
                    data: { 'scores': scoreJson },
                    url: '/saveIndividualScore',
                }).then(function successCallback(response) {
                    vm.openBottomSheet(overallScoreVal);
                }, function errorCallback(response) {
                    console.log("error in save config");
                });
            }
        };
        vm.openBottomSheet = function(overallScore) {
            vm.overallScore = overallScore;
            $mdBottomSheet.show({
                parent: '#application-content',
                locals: { score: vm.overallScore },
                controller: 'overallScoreCtrl',
                controllerAs: 'vm',
                templateUrl: 'src/app/score/overallScore.html'
            });
        };

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item) {
                return (item.name.toLowerCase().indexOf(lowercaseQuery) === 0);
            };
        }

        $scope.showAlert = function() {
            var alert = $mdDialog.alert()
                .clickOutsideToClose(true)
                .title('Error!')
                .textContent('Please enter all fields')
                .ariaLabel('Error')
                .ok('OK');
            $mdDialog.show(alert);
        };

    }

})();
