(function() {
    'use strict';
    angular
        .module('appraisal')
        .controller('overallScoreCtrl', OverallScore);
    OverallScore.$inject = ['$scope', '$mdBottomSheet', 'score'];

    function OverallScore($scope, $mdBottomSheet, score) {
        /*jshint validthis: true */
        var vm = this;
        vm.overallScore = score;
        vm.hideResult = function() {
            $mdBottomSheet.hide();
        };
    }


})();
