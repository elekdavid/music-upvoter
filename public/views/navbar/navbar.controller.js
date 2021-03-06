(function () {
    'use strict';

    angular
        .module('musicUpvoterApp')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$scope'];

    function NavbarController($scope) {
        var vm = this;

        function init() {
            $scope.$parent.isAuthReady = true;
        }

        vm.currentUser = function () {
            return firebase.auth().currentUser;
        };

        vm.loginWithFacebook = function () {
            firebase.auth().signInWithRedirect(new firebase.auth.FacebookAuthProvider());
        };

        vm.logout = function () {
            firebase.auth().signOut().then(function() {
                $scope.$apply();
            });
        };

        init();
    }
})();
