(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('dataservice', dataservice);

    /* @ngInject */
    function dataservice($http, $q, $rootScope, $log) {
        var service = {
            getConfigFile  : getConfigFile,
            getAlojamientos: getAlojamientos,
            getAlojamientoDetalle: getAlojamientoDetalle
        };

        return service;

        function getConfigFile() {
            return $http.get('urlconfig.json')
                .then(getConfigFileComplete)
                .catch(function (message) {
                    $log.log('XHR Failed for getAlojamientos: ' + message);
                });

            function getConfigFileComplete(data, status, headers, config) {
                return data.data;
            }
        }

        function getAlojamientos(localidad) {
            return $http.get($rootScope.siteConfig.url + '/v2/search_results?client_id=3092nxybyb0otqw18e8nh5nty&locale=en-US&_limit=30&_offset=0&location=' + localidad)
                .then(getAlojamientosComplete)
                .catch(function (message) {
                    $log.log('XHR Failed for getAlojamientos: '+ message.status);
                     return [];
                });

            function getAlojamientosComplete(data, status, headers, config) {
                var datos = [];
                angular.forEach(data.data.search_results, function (record) {
                    datos.push({
                        id              : record.listing.id,
                        img_principal   : record.listing.picture_url,
                        ciudad          : record.listing.city,
                        nombre          : record.listing.name,
                        calificacion    : record.listing.star_rating,
                        direccion       : record.listing.public_address,
                        tipo_propiedad  : record.listing.property_type,
                        tipo_habitacion : record.listing.room_type,
                        num_huespedes   : record.listing.person_capacity,
                        num_banos       : record.listing.bathrooms,
                        num_dormitorios : record.listing.bedrooms,
                        num_camas       : record.listing.beds,
                        precio          : record.pricing_quote.localized_nightly_price,
                        moneda          : record.pricing_quote.localized_currency,
                        lat             : record.listing.lat,
                        lng             : record.listing.lng,
                        fotos           : record.listing.picture_urls
                    });
                });
                return datos;
            }
        }

        function getAlojamientoDetalle(id) {
            return $http.get($rootScope.siteConfig.url + '/v2/listings/'+id+'?client_id=3092nxybyb0otqw18e8nh5nty&locale=en-US&_format=v1_legacy_for_p3')
                .then(getAlojamientosComplete)
                .catch(function (message) {
                    $log.log('XHR Failed for getAlojamientos: '+ message.status);
                    return [];
                });

            function getAlojamientosComplete(data, status, headers, config) {
                var record = data.data.listing;

                var datos = {
                    id              : record.id,
                    img_principal   : record.picture_url,
                    ciudad          : record.city,
                    estado          : record.state,
                    pais            : record.country,
                    nombre          : record.name,
                    calificacion    : record.star_rating,
                    direccion       : record.public_address,
                    tipo_propiedad  : record.property_type,
                    tipo_habitacion : record.room_type,
                    num_huespedes   : record.person_capacity,
                    num_banos       : record.bathrooms,
                    num_dormitorios : record.bedrooms,
                    num_camas       : record.beds,
                    precio          : record.price_native,
                    moneda          : record.native_currency,
                    lat             : record.lat,
                    lng             : record.lng,
                    fotos           : record.picture_urls,
                    descripcion     : record.description
                };
                return datos;
            }
        }
    }
})();
