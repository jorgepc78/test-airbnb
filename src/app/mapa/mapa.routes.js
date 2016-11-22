/*  eslint linebreak-style: ["error", "windows"]*/
(function () {
    'use strict';

    angular
        .module('app.mapa')
        .config(configure);

    /* @ngInject */
    function configure($stateProvider) {
        $stateProvider
            .state('principal.mapa', {
                url: '/mapa',
                templateUrl: 'app/mapa/mapa.html',
                controller: 'MapaController',
                controllerAs: 'vm',
                resolve: {
                    check: function (DataPerfil, $location) {
                        if (DataPerfil.checkPermission()) {

                        } else {
                            $location.path('/login');
                        }
                    }
                }
            });
    }
})();
