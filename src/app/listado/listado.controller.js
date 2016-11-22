/*  eslint linebreak-style: ["error", "windows"]*/
(function () {
    'use strict';

    angular
        .module('app.listado')
        .controller('ListadoController', ListadoController);

    /* @ngInject */
    function ListadoController(dataservice, $geolocation, $rootScope, $uibModal, $log) {
        var vm = this;
        
        vm.cambiarPagina = cambiarPagina;
        vm.detalleLugar = detalleLugar;

        vm.listaAlojamientos = [];
        vm.listaAlojamientosFiltrado = [];
        vm.country = '';
        vm.state = '';
        vm.city = '';
        vm.cargando = true;

        vm.listaAlojamientosConfig = {
              totalElementos     : 0,
              paginaActual       : 0,
              registrosPorPagina : 3,
              inicio             : 0,
              fin                : 1,
              numPaginas         : 1
        };

        activate();

        function activate() {
            $geolocation.getCurrentPosition({
                timeout: 60000
            }).then(function (position) {
                    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    var geocoder = new google.maps.Geocoder();

                    geocoder.geocode({
                        latLng: latlng
                    },
                    function (results, status)
                    {
                        if (status === google.maps.GeocoderStatus.OK) {
                                if (results[0]) {
                                    var address_array = results[0].address_components;
                                    if (address_array.length <= 7) {
                                        vm.country = address_array[6].long_name;
                                        vm.state = address_array[5].long_name;
                                        vm.city = address_array[3].long_name;
                                    } else {
                                        vm.country = address_array[(address_array.length - 2)].long_name;
                                        vm.state = address_array[(address_array.length - 3)].long_name;
                                        vm.city = address_array[(address_array.length - 5)].long_name;
                                    }
                                    var localidad = vm.city + ' ' + vm.state + ' ' + vm.country;
                                    procesaDatos(localidad);
                                } else {
                                    $log.log("address not found");
                                }
                        }
                    });
            }, function (error) {
                    vm.country = 'USA';
                    vm.state = 'CA';
                    vm.city = 'Los Angeles';
                    var localidad = vm.city + ' ' + vm.state + ' ' + vm.country;
                    procesaDatos(localidad);
            });
        }

        function procesaDatos(localidad) {
            dataservice.getAlojamientos(localidad).then(function (data) {
                vm.listaAlojamientos = data;
                vm.listaAlojamientosFiltrado = vm.listaAlojamientos.slice(vm.listaAlojamientosConfig.paginaActual, vm.listaAlojamientosConfig.registrosPorPagina);
                vm.listaAlojamientosConfig.totalElementos = vm.listaAlojamientos.length;
                vm.listaAlojamientosConfig.numPaginas = Math.ceil(vm.listaAlojamientos.length/vm.listaAlojamientosConfig.registrosPorPagina);
                vm.cargando = false;

                if (vm.listaAlojamientosConfig.totalElementos === 0)
                    vm.listaAlojamientosConfig.paginaActual = -1;
            });
        }

        function cambiarPagina(direccion) {
            if (direccion === 'adelante') {
                if ((vm.listaAlojamientosConfig.paginaActual + 1) < vm.listaAlojamientosConfig.numPaginas) {
                    vm.listaAlojamientosConfig.paginaActual = vm.listaAlojamientosConfig.paginaActual + 1;
                    var inicio = (vm.listaAlojamientosConfig.paginaActual) * vm.listaAlojamientosConfig.registrosPorPagina;
                    var fin = inicio + vm.listaAlojamientosConfig.registrosPorPagina;
                    vm.listaAlojamientosFiltrado = vm.listaAlojamientos.slice(inicio, fin);                    
                }
            } else {
                if (vm.listaAlojamientosConfig.paginaActual > 0) {
                    vm.listaAlojamientosConfig.paginaActual = vm.listaAlojamientosConfig.paginaActual - 1;
                    var inicio = (vm.listaAlojamientosConfig.paginaActual) * vm.listaAlojamientosConfig.registrosPorPagina;
                    var fin = inicio + vm.listaAlojamientosConfig.registrosPorPagina;
                    vm.listaAlojamientosFiltrado = vm.listaAlojamientos.slice(inicio, fin);
                }
            }
        }

        function detalleLugar(id) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/modal-detalle/modal-detalle-lugar.html',
                windowClass: "fade ql-modal",
                controller: 'ModalDetalleLugarController as vm',
                resolve: {
                    idLugar: function () {
                        return id;
                    }
                }
            })

            modalInstance.result.then(function () {
                }, function () {
                });
            }
        }
})();
