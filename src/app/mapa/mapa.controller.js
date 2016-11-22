/*  eslint linebreak-style: ["error", "windows"]*/
(function () {
    'use strict';

    angular
        .module('app.mapa')
        .controller('MapaController', MapaController);

    /* @ngInject */
    function MapaController($scope, $document, $log, dataservice, $geolocation, $rootScope, $window, $timeout, $compile, $uibModal) {
        var vm = this;

        vm.detalleLugar = detalleLugar;

        vm.listaAlojamientos = [];
        vm.country = '';
        vm.state = '';
        vm.city = '';
        vm.cargando = true;
        vm.map = undefined;
        vm.marcadores = [];

        vm.mapContainer = {
            width: "100%",
            height: ($window.innerHeight - 230) + 'px'
        };

        activate();

        function activate() {
            var mapOptions = {
              center: new google.maps.LatLng(19.886619, -39.558636),
              zoom: 4,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map($document[0].getElementById("map"), mapOptions);

            vm.map = map;
            google.maps.event.trigger(vm.map, 'resize');

            $geolocation.getCurrentPosition({
                timeout: 60000
            })
            .then(function (position) {
                    $timeout(function () {
                        google.maps.event.trigger(vm.map, 'resize');
                        vm.map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
                        vm.map.setZoom(13);
                    }, 1500);

                    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    var geocoder = new google.maps.Geocoder();

                    geocoder.geocode({
                        latLng: latlng
                    },
                    function (results, status) {
                        if (status === google.maps.GeocoderStatus.OK) {
                            if (results[0]) {
                                var addressArray = results[0].address_components;
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
            },
            function (error) {
                    $log.log(error);
                    $timeout(function () {
                        google.maps.event.trigger(vm.map, 'resize');
                        vm.map.panTo(new google.maps.LatLng(34.036243, -118.248200));
                        vm.map.setZoom(13);
                    }, 1500);

                    vm.country = 'USA';
                    vm.state = 'CA';
                    vm.city = 'Los Angeles';
                    var localidad = vm.city + ' ' + vm.state + ' ' + vm.country;
                    procesaDatos(localidad);
            });
        }

        function procesaDatos(localidad) {
            $rootScope.currentUser.ubicacion = localidad;
            dataservice.getAlojamientos(localidad).then(function (data) {
                vm.listaAlojamientos = data;
                vm.totalElementos = vm.listaAlojamientos.length;
                vm.cargando = false;

                var bounds = new google.maps.LatLngBounds();

                angular.forEach(data, function (record) {
                    bounds.extend(new google.maps.LatLng(record.lat, record.lng));

                    var image = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2238%22%20height%3D%2238%22%20viewBox%3D%220%200%2038%2038%22%3E%3Cpath%20fill%3D%22%23808080%22%20stroke%3D%22%23ccc%22%20stroke-width%3D%22.5%22%20d%3D%22M34.305%2016.234c0%208.83-15.148%2019.158-15.148%2019.158S3.507%2025.065%203.507%2016.1c0-8.505%206.894-14.304%2015.4-14.304%208.504%200%2015.398%205.933%2015.398%2014.438z%22%2F%3E%3Ctext%20transform%3D%22translate%2819%2018.5%29%22%20fill%3D%22%23fff%22%20style%3D%22font-family%3A%20Arial%2C%20sans-serif%3Bfont-weight%3Abold%3Btext-align%3Acenter%3B%22%20font-size%3D%2212%22%20text-anchor%3D%22middle%22%3E' + record.precio + '$%3C%2Ftext%3E%3C%2Fsvg%3E';

                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(record.lat, record.lng),
                        icon: image,
                        title: record.nombre,
                        map: vm.map
                    });

                    var contentString = '        <div class="card card-cascade" style="width:400px;padding-top: 15px;padding-left:27px;padding-right: 10px;box-shadow: none;">'+
                                        '            <div class="view overlay hm-white-slight">'+
                                        '                <img src="'+record.img_principal+'" class="img-fluid" alt="">'+
                                        '                <a><div class="mask"></div></a>'+
                                        '            </div>'+
                                        '            <div class="card-block text-xs-center" style="padding-bottom: 0;>'+
                                        '                <h5>'+record.ciudad+'</h5>'+
                                        '                <h4 class="card-title"><strong>'+record.nombre+'</strong></h4>'+
                                        '                <ul class="rating">'+
                                        '                    <li><i class="fa '+ (record.calificacion >= 1 ? 'fa-star' : 'fa-star-o') +'"></i></li>'+
                                        '                    <li><i class="fa '+ (record.calificacion >= 2 ? 'fa-star' : 'fa-star-o') +'"></i></li>'+
                                        '                    <li><i class="fa '+ (record.calificacion >= 3 ? 'fa-star' : 'fa-star-o') +'"></i></li>'+
                                        '                    <li><i class="fa '+ (record.calificacion >= 4 ? 'fa-star' : 'fa-star-o') +'"></i></li>'+
                                        '                    <li><i class="fa '+ (record.calificacion >= 5 ? 'fa-star' : 'fa-star-o') +'"></i></li>'+
                                        '                </ul>'+
                                        '                <p class="card-text">'+record.direccion+'</p>'+
                                        '                <div class="card-footer">'+
                                        '                    <span class="left">'+record.precio+'$ '+record.moneda+'</span>'+
                                        '                    <span class="right"><a class="btn btn-primary waves-effect" ng-click="vm.detalleLugar('+record.id+')">Detalles</a></span>'+
                                        '                </div>'+
                                        '            </div>'+
                                        '        </div>';

                    var compiledContent = $compile(contentString)($scope);

                    vm.infowindow = new google.maps.InfoWindow({});

                    marker.addListener('click', function () {
                        vm.infowindow.close();
                        vm.infowindow = new google.maps.InfoWindow({
                            content: compiledContent[0]
                        });
                        vm.infowindow.open(vm.map, marker);
                    });

                    vm.marcadores.push(marker);
                });

                $timeout(function () {
                    vm.map.fitBounds(bounds);
                }, 500);
            });
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
            });

            modalInstance.result.then(function () {
            }, function () {
            });
        }
    }
})();
