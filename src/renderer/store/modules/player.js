"use strict";
exports.__esModule = true;
exports.MUTATIONS = {
    SET_TRACK: "setTrack",
    SET_IS_PLAYING: "setIsPlaying",
    SET_PLAYLIST: "setPlaylist",
    SET_QUEUE_POSITION: "setQueuePosition",
    SET_PROGRESS: "setProgress",
    SET_PRIMARY_MUSIC_SOURCE: "setPrimaryMusicSource"
};
exports.ACTIONS = {
    TOGGLE_PLAY_PAUSE_FOR_TRACK: "togglePlayPauseForTrack",
    SET_TRACK: "setTrack",
    SET_IS_PLAYING: "setIsPlaying",
    PLAY_TRACK: "playTrack",
    RESUME_TRACK: "resumeTrack",
    PAUSE_TRACK: "pauseTrack",
    SET_PROGRESS: "setProgress",
    SET_PRIMARY_MUSIC_SOURCE: "setPrimaryMusicSource"
};
exports.ACTIONS.foo;
exports.GETTERS = {
    IS_PLAYING_TRACK: "isPlayingTrack"
};
function makePlayerModule() {
    var _a, _b;
    return {
        namespaced: true,
        state: {
            isPlaying: false,
            primaryMusicSource: null,
            track: null,
            progress: {
                progressMs: null
            }
        },
        mutations: (_a = {},
            _a[exports.MUTATIONS.SET_TRACK] = function (state, track) {
                state.track = track;
            },
            _a[exports.MUTATIONS.SET_IS_PLAYING] = function (state, isPlaying) {
                state.isPlaying = isPlaying;
            },
            _a[exports.MUTATIONS.SET_PROGRESS] = function (state, progressMs) {
                state.progress.progressMs = progressMs;
            },
            _a[exports.MUTATIONS.SET_PRIMARY_MUSIC_SOURCE] = function (state, source) {
                state.primaryMusicSource = source;
            },
            _a),
        actions: (_b = {},
            _b[exports.ACTIONS.SET_TRACK] = function (store, track) {
                store.commit(exports.MUTATIONS.SET_TRACK, track);
            },
            _b[exports.ACTIONS.SET_IS_PLAYING] = function (store, isPlaying) {
                store.commit(exports.MUTATIONS.SET_IS_PLAYING, isPlaying);
            },
            _b[exports.ACTIONS.PLAY_TRACK] = function (store, args) {
                store.dispatch(exports.ACTIONS.SET_TRACK, args.track);
                store.commit(exports.MUTATIONS.SET_IS_PLAYING, true);
            },
            _b[exports.ACTIONS.RESUME_TRACK] = function (store) {
                store.commit(exports.MUTATIONS.SET_IS_PLAYING, true);
            },
            _b[exports.ACTIONS.PAUSE_TRACK] = function (store) {
                store.commit(exports.MUTATIONS.SET_IS_PLAYING, false);
            },
            _b[exports.ACTIONS.SET_PROGRESS] = function (store, progressMs) {
                store.commit(exports.MUTATIONS.SET_PROGRESS, progressMs);
            },
            _b[exports.ACTIONS.SET_PRIMARY_MUSIC_SOURCE] = function (store, source) {
                store.commit(exports.MUTATIONS.SET_PRIMARY_MUSIC_SOURCE, source);
            },
            _b)
    };
}
exports.makePlayerModule = makePlayerModule;
