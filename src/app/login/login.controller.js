/*  eslint linebreak-style: ["error", "windows"]*/
(function () {
    'use strict';

    angular
        .module('app.login')
        .controller('LoginController', LoginController);

    /* @ngInject */
    function LoginController($rootScope, $state, $timeout, $log, localStorageService, GooglePlus, Facebook) {
        var vm = this;

        vm.login = login;

        vm.cargando = false;

        activate();

        function activate() {
        }

        function login(provider) {
            vm.cargando = true;
            if (provider === 'google') {
                    GooglePlus.login().then(function (authResult) {
                      GooglePlus.getUser().then(function (user) {
                            $rootScope.currentUser = {
                                tipo_login : 'google',
                                nombre : user.given_name,
                                apellidos : user.family_name,
                                foto : user.picture
                            };

                            $timeout(function () {
                                localStorageService.set('usuario', $rootScope.currentUser);
                                $state.go('principal.listado');
                            }, 1500);
                      });
                    }, function (err) {
                      $log.log(err);
                    });                
            } else if (provider === 'facebook') {
                  Facebook.getLoginStatus(function (response) {
                    if (response.status === 'connected') {
                        getCurrentUserInfo();
                    } else {
                        Facebook.login(function (response) {
                            getCurrentUserInfo();
                        });
                    }
                  });
            }
        }

        function getCurrentUserInfo() {
              Facebook.api('/me', {fields: 'first_name, last_name, picture'}, function (response) {

                    $rootScope.currentUser = {
                        tipo_login : 'facebook',
                        nombre : response.first_name,
                        apellidos : response.last_name,
                        foto : response.picture.data.url
                    };

                    $timeout(function () {
                        localStorageService.set('usuario', $rootScope.currentUser);
                        $state.go('principal.listado');
                    }, 1500);
              });
        }
    }
})();
