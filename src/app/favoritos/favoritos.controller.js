/*  eslint linebreak-style: ["error", "windows"]*/
(function () {
    'use strict';

    angular
        .module('app.favoritos')
        .controller('FavoritosController', FavoritosController);

    /* @ngInject */
    function FavoritosController($rootScope, localStorageService) {
        var vm = this;

        vm.cambiarPagina = cambiarPagina;
        vm.eliminaFavoritos = eliminaFavoritos;

        vm.listaAlojamientos = [];
        vm.listaAlojamientosFiltrado = [];
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

            vm.listaAlojamientos = $rootScope.favoritosUser;
            vm.listaAlojamientosFiltrado = vm.listaAlojamientos.slice(vm.listaAlojamientosConfig.paginaActual, vm.listaAlojamientosConfig.registrosPorPagina);
            vm.listaAlojamientosConfig.totalElementos = vm.listaAlojamientos.length;
            vm.listaAlojamientosConfig.numPaginas = Math.ceil(vm.listaAlojamientos.length/vm.listaAlojamientosConfig.registrosPorPagina);
            vm.cargando = false;

            if(vm.listaAlojamientosConfig.totalElementos === 0)
                vm.listaAlojamientosConfig.paginaActual = -1;
        }

        function cambiarPagina(direccion) {
            if (direccion == 'adelante') {
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

        function eliminaFavoritos(idLugar) {
            var index = $rootScope.favoritosUser.map(function (record) {
                            return record.id;
                        }).indexOf(idLugar);

            if (index >= 0) {
                $rootScope.favoritosUser.splice(index, 1);
                localStorageService.set('favoritos', $rootScope.favoritosUser);
                activate();
            }
        }
    }
})();
