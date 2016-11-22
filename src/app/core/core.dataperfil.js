(function () {
  'use strict';

	angular
	    .module('app.core')
	    .factory('DataPerfil', DataPerfil);

	/* @ngInject */
	function DataPerfil($rootScope, localStorageService, dataservice) {

        var service = {
            checkPermission  : checkPermission
        };

        return service;

		function checkPermission() {
      if ($rootScope.currentUser)
      	return true;
      else
      	return false;
		}
	};
})();
