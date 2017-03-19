(function() {
    'use strict';

    angular
        .module('musicUpvoterApp')
        .controller('HomeController', HomeController);

    HomeController.$inject = [];

    function HomeController () {
        var vm = this;

        vm.musics = [
            {
                id: "1",
                title : "Dj Fresh - Gold Dust",
                upvote: 11,
                userReview: 1
            },
            {
                id: "2",
                title : "Lykke Li - I Follow Rivers",
                upvote: 30,
                userReview: -1
            },
            {
                id: "3",
                title : "Kaukázus - Szalai Éva",
                upvote: -5,
                userReview: 0
            }
        ];

        function init() {
            console.log("INIT HOME")
        }

        vm.addNew = function (title) {
            console.log("Here we should add a new title: " + title);
        };

        vm.upvote = function (id) {
            console.log("Here we should upvote music with id: " + id);
        };

        vm.downvote = function (id) {
            console.log("Here we should downvote music with id: " + id);
        };

        vm.upvoteClass = function(music) {
            var classString = "";
            switch (music.userReview) {
                case 1:
                    classString += "upvote-user-pos";
                    break;
                case -1:
                    classString += "upvote-user-neg";
                    break;
                case 0:
                    classString += "upvote-user-zero";
                    break;
            }

            if (music.upvote > 0) {
                classString += " upvote-pos";
            } else if (music.upvote == 0) {
                classString += " upvote-zero";
            } else {
                classString += " upvote-neg";
            }

            return classString;
        };

        init();
    }
})();
