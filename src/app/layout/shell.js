(function () {
    'use strict';

    angular
        .module('app.layout')
        .controller('Shell', Shell);

    /* @ngInject */
    function Shell($timeout, $state, $document, $rootScope, localStorageService, GooglePlus) {
        /*jshint validthis: true */
        var vm = this;

        vm.logout = logout;
        vm.cerrar = cerrar;

        vm.usuario = {};

        activate();

        function activate() {
            vm.usuario = $rootScope.currentUser;
            // SideNav init
            angular.element(".button-collapse").sideNav({
              edge: 'left',
              closeOnClick: true
            });
            var el = $document[0].querySelector('.custom-scrollbar');
            Ps.initialize(el);
        }

        function logout() {
            $timeout(function () {
                if($rootScope.currentUser === 'google')
                    GooglePlus.logout();
                
                $rootScope.currentUser = null;
                localStorageService.remove('usuario');
                $rootScope.favoritosUser = null;
                localStorageService.remove('favoritos');
                $state.go('login');
            }, 1000);
        }

        function cerrar() {
            angular.element('.button-collapse').sideNav('hide');
        }
    }
})();
