/*  eslint linebreak-style: ["error", "windows"]*/
(function () {
    'use strict';

    angular
        .module('app.login')
        .config(configure);

    /* @ngInject */
    function configure($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'app/login/login.html',
                controller: 'LoginController',
                controllerAs: 'vm',
                resolve: {
                    check: function (DataPerfil, $location) {
                        if (DataPerfil.checkPermission()) {
                            $location.path('/principal/listado');
                        } else {
                            $location.path('/login');
                        }
                    }
                }
            });
    }
})();
