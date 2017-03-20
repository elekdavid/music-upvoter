(function () {
    'use strict';

    angular
        .module('musicUpvoterApp')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', '$firebaseArray', "$mdDialog", "$timeout", "SpotifyService"];

    function HomeController($scope, $firebaseArray, $mdDialog, $timeout, SpotifyService) {
        var vm = this;
        var ref;

        var tracks = {};

        function init() {
            $scope.$parent.isMusicsLoaded = false;
            ref = firebase.database().ref().child("/musics");

            vm.musics = $firebaseArray(ref);
            vm.musics.$loaded().then(function () {
                $scope.$parent.isMusicsLoaded = true;
                angular.forEach(vm.musics, function (music) {
                    SpotifyService.findTrack(music.title).then(function (track) {
                        tracks[music.$id] = track;
                    });
                });
            });
        }


        vm.addNew = function () {
            if (!firebase.auth().currentUser) {
                return;
            }

            var newMusicRef = ref.push();
            newMusicRef.set({
                title: vm.musicTitle,
                creator: firebase.auth().currentUser.uid,
                createdAt: +new Date()
            }).then(function () {

                var path = newMusicRef.toString();
                var id = path.split('/')[path.split('/').length - 1];
                var music = vm.musics.find(function (m) {
                    return m.$id === id;
                });

                vm.upvote(music, 1);

                vm.musicTitle = "";

                SpotifyService.findTrack(music.title).then(function (track) {
                    tracks[id] = track;
                    $scope.$apply();
                });

                $scope.$apply();
            });
        };

        vm.remove = function (music) {
            if (!firebase.auth().currentUser) {
                return;
            }

            if (firebase.auth().currentUser.uid !== music.creator) {
                return;
            }

            var confirm = $mdDialog.confirm()
                .title('Biztos hogy törölni akarod? A szavazotkat elveszíted a számra!')
                .ok('Igen, töröljük, szar a szám!')
                .cancel('Nem, hagyjuk');

            $mdDialog.show(confirm).then(function () {
                vm.musics.$remove(music);
            });

        };

        vm.upvotesOfMusic = function (music) {
            var upvotes = 0;
            angular.forEach(music.upvotes, function (upvote) {
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

            music.upvotes[firebase.auth().currentUser.uid].updatedAt = +new Date();

            vm.musics.$save(music);
        };

        vm.getArt = function (music) {
            if (tracks[music.$id] &&
                tracks[music.$id].album &&
                tracks[music.$id].album.images &&
                tracks[music.$id].album.images.length > 0) {
                return tracks[music.$id].album.images[0].url;
            } else {
                return "";
            }
        };

        vm.getYoutubeLink = function (music) {
            var searchQuery = music.title.replace(/\s/g, "+");
            return "https://www.youtube.com/results?search_query=" + searchQuery;
        };

        vm.getSpotifyLink = function (music) {
            if (tracks[music.$id] && tracks[music.$id].external_urls) {
                return tracks[music.$id].external_urls.spotify;
            } else {
                return "";
            }
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

        vm.isLoggedIn = function () {
            return firebase.auth().currentUser !== null;
        };

        vm.isRemovable = function (music) {
            return firebase.auth().currentUser && firebase.auth().currentUser.uid === music.creator;
        };

        init();
    }
})();
