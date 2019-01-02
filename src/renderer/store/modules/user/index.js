"use strict";
exports.__esModule = true;
var spotify_1 = require("./spotify");
var youtube_1 = require("./youtube");
var spotify_2 = require("./spotify");
exports.spotifyModulePlugin = spotify_2.spotifyModulePlugin;
function makeUserModule(options) {
    return {
        namespaced: true,
        modules: {
            spotify: spotify_1.makeSpotifyModule(),
            youtube: youtube_1.makeYouTubeModule()
        }
    };
}
exports["default"] = makeUserModule;
