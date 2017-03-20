(function () {
    'use strict';

    angular
        .module('musicUpvoterApp')
        .filter('filterNotUpvoted', FilterNotUpvoted);

    function FilterNotUpvoted() {
        return function (musics) {
            if (!firebase.auth().currentUser) {
                return [];
            }

            var uid = firebase.auth().currentUser.uid;

            return musics.filter(function (music) {
                return angular.isUndefined(music.upvotes) ||
                    angular.isUndefined(music.upvotes[uid]) ||
                    music.upvotes[uid] === 0;
            });
        }
    }
})();
