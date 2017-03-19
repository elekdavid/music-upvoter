(function() {
    'use strict';

    angular
        .module('musicUpvoterApp')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = [];

    function NavbarController () {
        var vm = this;

        function init() {

            console.log("INIT NAVBAR")
        }

        init();
    }
})();
