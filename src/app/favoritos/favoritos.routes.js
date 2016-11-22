/*  eslint linebreak-style: ["error", "windows"]*/
(function () {
    'use strict';

    angular
        .module('app.favoritos')
        .config(configure);

    /* @ngInject */
    function configure($stateProvider) {
        $stateProvider
            .state('principal.favoritos', {
                url: '/favoritos',
                templateUrl: 'app/favoritos/favoritos.html',
                controller: 'FavoritosController',
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
