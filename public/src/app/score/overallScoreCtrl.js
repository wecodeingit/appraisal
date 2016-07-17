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
