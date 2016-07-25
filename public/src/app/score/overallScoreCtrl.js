(function() {
    'use strict';
    angular
        .module('appraisal')
        .controller('overallScoreCtrl', OverallScore);
    OverallScore.$inject = ['$scope', '$mdBottomSheet', '$interval', 'score'];

    function OverallScore($scope, $mdBottomSheet, $interval, score) {
        /*jshint validthis: true */
        var vm = this;
        var deltaTime = 10;
        var intervalTime = 100;
        vm.score = 0;
        vm.overallScore = score;
        $interval(function() {
            if (vm.score < vm.overallScore) {
                vm.score++;
            }
        }, ((intervalTime / vm.overallScore) * deltaTime));
        vm.hideResult = function() {
            $mdBottomSheet.hide();
        };
    }


})();
