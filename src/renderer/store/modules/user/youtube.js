"use strict";
exports.__esModule = true;
var GETTERS = {
    PLAYER: {
        IS_PLAYING_TRACK: "player/isPlayingTrack"
    }
};
function makeYouTubeModule() {
    var _a;
    return {
        namespaced: true,
        state: {
            isPlaying: false,
            track: null
        },
        getters: (_a = {},
            _a[GETTERS.PLAYER.IS_PLAYING_TRACK] = function (state) {
                return function (track) {
                    return (track && state.isPlaying && state.track && state.track.id == track.id) || false;
                };
            },
            _a)
    };
}
exports.makeYouTubeModule = makeYouTubeModule;
