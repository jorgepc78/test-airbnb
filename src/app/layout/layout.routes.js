/*  eslint linebreak-style: ["error", "windows"]*/
(function () {
    'use strict';

    angular
        .module('app.layout')
        .config(configure);

    /* @ngInject */
    function configure($stateProvider) {
        $stateProvider
            .state('principal', {
                abstract: true,
                url: '/principal',
                templateUrl: 'app/layout/shell.html'
            });
    }
})();
