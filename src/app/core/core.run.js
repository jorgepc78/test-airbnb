(function () {
    'use strict';

    angular
        .module('app.core')
        .run(runBlock);

    /* @ngInject */    
    function runBlock($rootScope, $state, localStorageService, dataservice) {
            $rootScope.$on('$stateChangeStart', function (event, next) {

                $rootScope.favoritosUser = [];
                
                if (localStorageService.get('usuario') !== undefined && localStorageService.get('usuario') !== null)
                        $rootScope.currentUser = localStorageService.get('usuario');

                if (localStorageService.get('favoritos') !== undefined && localStorageService.get('favoritos') !== null)
                        $rootScope.favoritosUser = localStorageService.get('favoritos');

                dataservice.getConfigFile().then(function (data) {
                    $rootScope.siteConfig = data;

                    if (!$rootScope.currentUser) {
                        event.preventDefault();
                        $state.go('login');
                        return;
                    }
                });
            });
            $rootScope.$state = $state;
    }
})();
