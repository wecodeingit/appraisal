(function() {
    'use strict';

    var modules = ['ngAria', 'ngAnimate', 'ngMaterial', 'ui.router', 'templates'].filter(function(module) {
        try {
            return !!angular.module(module);
        } catch (e) {}
    });

    angular.module('appraisal', modules);



})();

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


    }




})();

(function() {
        'use strict';


    routerConfig.$inject = ["$stateProvider", "$urlRouterProvider"];
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

(function() {
    'use strict';
    angular
        .module('appraisal')
        .controller('overallScoreCtrl', OverallScore);
    OverallScore.$inject = ['$scope', 'score'];

    function OverallScore($scope, score) {
        /*jshint validthis: true */
        var vm = this;
        vm.overallScore = score;
    }

})();

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
                    console.log(response);
                }, function errorCallback(response) {
                    console.log("error in save config");
                });

                vm.openBottomSheet(overallScoreVal);
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
