"use strict";
exports.__esModule = true;
var vue_1 = require("vue");
var vuex_1 = require("vuex");
vue_1["default"].use(vuex_1["default"]);
var vuex_electron_1 = require("vuex-electron");
var user_1 = require("./modules/user");
var playlists_1 = require("./modules/playlists");
var player_1 = require("./modules/player");
var ui_1 = require("./modules/ui");
function makeStore(options) {
    return new vuex_1["default"].Store({
        modules: {
            user: user_1["default"](options.user),
            player: player_1.makePlayerModule(),
            playlists: playlists_1.makePlaylistsModule(),
            ui: ui_1.makeUiModule()
        },
        plugins: [vuex_electron_1.createPersistedState(), user_1.spotifyModulePlugin()],
        strict: true
    });
}
exports["default"] = makeStore;
