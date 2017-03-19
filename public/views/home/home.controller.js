(function () {
    'use strict';

    angular
        .module('musicUpvoterApp')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', '$firebaseArray', "$mdDialog"];

    function HomeController($scope, $firebaseArray, $mdDialog) {
        var vm = this;
        var ref;

        function init() {
            $scope.$parent.isMusicsLoaded = false;
            ref = firebase.database().ref().child("/musics");

            vm.musics = $firebaseArray(ref);
            vm.musics.$loaded().then(function() {
                $scope.$parent.isMusicsLoaded = true;
            });
        }


        vm.addNew = function () {
            if (!firebase.auth().currentUser) {
                return;
            }

            var newMusicRef = ref.push();
            newMusicRef.set({
                title: vm.musicTitle,
                creator: firebase.auth().currentUser.uid
            }).then(function() {
                var path = newMusicRef.toString();
                var id = path.split('/')[path.split('/').length-1];
                var music = vm.musics.find(function(m) {
                    return m.$id === id;
                });

                vm.upvote(music, 1);

                vm.musicTitle = "";
                $scope.$apply();
            });
        };

        vm.remove = function (music) {
            var confirm = $mdDialog.confirm()
                .title('Bitzos hogy törölni akarod? A szavazotkat elveszíted a számra!')
                .ok('Igen, töröljük, szar a szám!')
                .cancel('Nem, hagyjuk');

            $mdDialog.show(confirm).then(function() {
                vm.musics.$remove(music);
            });

        };

        vm.upvotesOfMusic = function(music) {
            var upvotes = 0;
            angular.forEach(music.upvotes, function(upvote) {
                upvotes += upvote.value;
            });

            return upvotes;
        };

        vm.upvote = function (music, value) {
            if (!firebase.auth().currentUser) {
                return;
            }

            if (!music.upvotes) {
                music.upvotes = {};
            }

            if (!music.upvotes[firebase.auth().currentUser.uid]) {
                music.upvotes[firebase.auth().currentUser.uid] = {
                    value: 0
                }
            }

            music.upvotes[firebase.auth().currentUser.uid].value += value;

            if (music.upvotes[firebase.auth().currentUser.uid].value > 1) {
                music.upvotes[firebase.auth().currentUser.uid].value = 1;
            }

            if (music.upvotes[firebase.auth().currentUser.uid].value < -1) {
                music.upvotes[firebase.auth().currentUser.uid].value = -1;
            }

            vm.musics.$save(music);
        };

        vm.getLink = function(music) {
            var searchQuery = music.title.replace(" ", "+");
            return "https://www.youtube.com/results?search_query=" + searchQuery;
        };

        vm.upvoteClass = function (music) {
            if (!music.upvotes) {
                return "";
            }

            var classString = "";

            if (firebase.auth().currentUser && music.upvotes[firebase.auth().currentUser.uid]) {
                if (music.upvotes[firebase.auth().currentUser.uid].value === 1) {
                    classString += "upvote-user-pos";
                } else if (music.upvotes[firebase.auth().currentUser.uid].value === -1) {
                    classString += "upvote-user-neg";
                }
            }

            var upvoteValue = vm.upvotesOfMusic(music);
            if (upvoteValue > 0) {
                classString += " upvote-pos";
            } else if (upvoteValue < 0) {
                classString += " upvote-neg";
            }

            return classString;
        };

        vm.isLoggedIn = function() {
            return firebase.auth().currentUser !== null;
        };

        vm.isRemovable = function (music) {
            return firebase.auth().currentUser && firebase.auth().currentUser.uid === music.creator;
        };

        init();
    }
})();
