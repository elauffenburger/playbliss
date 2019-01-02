"use strict";
exports.__esModule = true;
exports.MUTATIONS = {
    SET_TOKEN: "setToken",
    SET_LOGGED_IN: "setLoggedIn",
    SET_PLAYLISTS: "setPlaylists",
    SET_USER: "setUser"
};
exports.ACTIONS = {
    SET_USER: "setUser",
    SET_TOKEN: "setToken",
    SET_PLAYLISTS: "setPlaylists",
    SET_LOGGED_IN: "setLoggedIn"
};
exports.spotifyModulePlugin = function () {
    var plugin;
    return function (store) {
        plugin = new SpotifyModulePlugin(store);
        plugin.bootstrap();
    };
};
function makeSpotifyModule() {
    var _a, _b;
    return {
        namespaced: true,
        state: {
            loggedIn: false,
            token: "",
            playlists: [],
            user: null
        },
        mutations: (_a = {},
            _a[exports.MUTATIONS.SET_TOKEN] = function (state, token) {
                state.token = token;
            },
            _a[exports.MUTATIONS.SET_LOGGED_IN] = function (state, loggedIn) {
                state.loggedIn = loggedIn;
            },
            _a[exports.MUTATIONS.SET_PLAYLISTS] = function (state, playlists) {
                state.playlists = playlists;
            },
            _a[exports.MUTATIONS.SET_USER] = function (state, user) {
                state.user = user;
            },
            _a),
        actions: (_b = {},
            _b[exports.ACTIONS.SET_TOKEN] = function (store, token) {
                store.commit(exports.MUTATIONS.SET_TOKEN, token);
            },
            _b[exports.ACTIONS.SET_USER] = function (store, user) {
                store.commit(exports.MUTATIONS.SET_USER, user);
                store.commit(exports.MUTATIONS.SET_LOGGED_IN, true);
            },
            _b[exports.ACTIONS.SET_LOGGED_IN] = function (store, loggedIn) {
                store.commit(exports.MUTATIONS.SET_LOGGED_IN, loggedIn);
            },
            _b[exports.ACTIONS.SET_PLAYLISTS] = function (store, playlists) {
                store.commit(exports.MUTATIONS.SET_PLAYLISTS, playlists);
            },
            _b)
    };
}
exports.makeSpotifyModule = makeSpotifyModule;
var SpotifyModulePlugin = /** @class */ (function () {
    function SpotifyModulePlugin(store) {
        this.store = store;
    }
    SpotifyModulePlugin.prototype.bootstrap = function () {
        // Check for an existing access_token and dispatch the login action to simulate a re-login
        var existingToken = this.store.state.user.spotify.token;
        if (existingToken) {
            this.store.dispatch("user/spotify/setToken", existingToken);
        }
    };
    return SpotifyModulePlugin;
}());
