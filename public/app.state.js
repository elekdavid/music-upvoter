(function() {
    'use strict';

    angular
        .module('musicUpvoterApp')
        .config(stateConfig);

    stateConfig.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];

    function stateConfig($locationProvider, $stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true).hashPrefix('!');

        $stateProvider.state('app', {
            abstract: true,
            views: {
                'navbar@': {
                    templateUrl: 'views/navbar/navbar.html',
                    controller: 'NavbarController',
                    controllerAs: 'vm'
                }
            }
        });
    }
})();
