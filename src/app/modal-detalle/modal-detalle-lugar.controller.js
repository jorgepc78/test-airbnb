/*  eslint linebreak-style: ["error", "windows"]*/
(function () {
    'use strict';

    angular
        .module('app.modal-detalle-lugar')
        .controller('ModalDetalleLugarController', ModalDetalleLugarController);

    /* @ngInject */
    function ModalDetalleLugarController($rootScope, $document, $uibModalInstance, $timeout, idLugar, dataservice, localStorageService) {
        var vm = this;

        vm.nextFoto = nextFoto;
        vm.prevFoto = prevFoto;
        vm.agregaFavoritos = agregaFavoritos;

        vm.datosLugar = {};
        vm.map = undefined;
        vm.mostrarBtnFav = true;

        activate();

        function activate() {
            var index = $rootScope.favoritosUser.map(function (record) {
                            return record.id;
                        }).indexOf(idLugar);

            if (index >= 0) {
                vm.mostrarBtnFav = false;
            }

            dataservice.getAlojamientoDetalle(idLugar)
            .then(function (data) {
                vm.datosLugar = data;
                angular.element('.carousel').carousel({
                  interval: 3000
                });

                var mapOptions = {
                  center: new google.maps.LatLng(vm.datosLugar.lat, vm.datosLugar.lng),
                  zoom: 16,
                  mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                var map = new google.maps.Map($document[0].getElementById("map2"), mapOptions);
                vm.map = map;

                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(vm.datosLugar.lat, vm.datosLugar.lng),
                    title: vm.datosLugar.direccion,
                    map: vm.map
                });

                google.maps.event.trigger(vm.map, 'resize');
            });
        }

        function nextFoto() {
            angular.element('.carousel').carousel('next');
        }

        function prevFoto() {
            angular.element('.carousel').carousel('prev');
        }

        function agregaFavoritos() {
            $rootScope.favoritosUser.push(
                vm.datosLugar
            );
            localStorageService.set('favoritos', $rootScope.favoritosUser);
            vm.mostrarBtnFav = false;
        }
    }
})();
