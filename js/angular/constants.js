(function() {
    'use strict';

    var API_URL = window.API_URL || 'http://localhost:3000/api/';

    angular.module('pt.constants', [])
        .constant('API_URL', API_URL)


        ;
})();
