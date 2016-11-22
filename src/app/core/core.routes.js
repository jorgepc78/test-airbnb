(function () {
    'use strict';

    angular
        .module('app.core')
        .config(configure);

    /* @ngInject */
    function configure($urlRouterProvider, $httpProvider, GooglePlusProvider, FacebookProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        GooglePlusProvider.init({
            clientId: '124896189160-n9n2knmbmtfbfa5gkc667bpoddi4bbjl.apps.googleusercontent.com',
            apiKey: 'AIzaSyCdMRoAOlM5HjpiklvdvLjCkdrRGrkfue4'
        });

        FacebookProvider.init('716027915221662');

        $urlRouterProvider.otherwise('principal/listado');
    }
})();
