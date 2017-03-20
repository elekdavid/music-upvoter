(function () {
    'use strict';

    angular
        .module('musicUpvoterApp')
        .factory('SpotifyService', SpotifyService);

    SpotifyService.$inject = ['$http', '$q', '$timeout', 'store'];

    function SpotifyService($http, $q, $timeout, store) {
        return {
            findTrack: findTrack
        };

        function findTrack(title) {
            var defer = $q.defer();

            var ONE_WEEK = 60 * 60 * 1000 * 24 * 7;

            if (!store.get('spotifyCache') || (new Date() - store.get('spotifyCache').$created > ONE_WEEK ) ) {
                store.set('spotifyCache', {
                    $created: +new Date()
                })
            }

            var spotifyCache = store.get('spotifyCache');

            if (spotifyCache[title]){
                defer.resolve(spotifyCache[title]);
            } else {
                $http.get(
                    "https://api.spotify.com/v1/search",
                    {
                        cache: true,
                        params: {
                            q: title,
                            limit: 1,
                            type: "track",
                            market: "hu"
                        }
                    })
                    .then(
                        function (response) {
                            var tracks = response.data.tracks;
                            if (tracks) {
                                if (tracks.total === 0) {
                                    spotifyCache[title] = {};
                                    defer.resolve({});
                                } else {
                                    spotifyCache[title] = tracks.items[0];
                                    defer.resolve(tracks.items[0]);
                                }
                                store.set('spotifyCache', spotifyCache);
                            }
                        }, function (error) {
                            if (error.status === 429) {
                                $timeout(function () {
                                    findTrack(title).then(function(track){
                                        defer.resolve(track);
                                    });
                                }, 5000)
                            }
                        });
            }

            return defer.promise;
        }
    }
})();
