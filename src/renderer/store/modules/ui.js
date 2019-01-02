"use strict";
exports.__esModule = true;
exports.MUTATIONS = {
    SET_SEARCH: "setSearch"
};
exports.ACTIONS = {
    SET_SEARCH: "setSearch"
};
function makeUiModule() {
    var _a, _b;
    return {
        namespaced: true,
        state: {
            search: ""
        },
        mutations: (_a = {},
            _a[exports.MUTATIONS.SET_SEARCH] = function (state, search) {
                state.search = search;
            },
            _a),
        actions: (_b = {},
            _b[exports.ACTIONS.SET_SEARCH] = function (store, search) {
                store.commit(exports.MUTATIONS.SET_SEARCH, search);
            },
            _b)
    };
}
exports.makeUiModule = makeUiModule;
