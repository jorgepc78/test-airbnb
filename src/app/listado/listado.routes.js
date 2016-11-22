/*  eslint linebreak-style: ["error", "windows"]*/
(function () {
    'use strict';

    angular
        .module('app.listado')
        .config(configure);

    /* @ngInject */
    function configure($stateProvider) {
        $stateProvider
            .state('principal.listado', {
                url: '/listado',
                templateUrl: 'app/listado/listado.html',
                controller: 'ListadoController',
                controllerAs: 'vm',
                resolve:{
                    "check":function (DataPerfil,$location) {
                        if(DataPerfil.checkPermission()) {

                        }else{
                            $location.path('/login');
                        }
                    }
                }

            });
    }
})();
