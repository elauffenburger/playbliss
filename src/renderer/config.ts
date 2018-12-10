import Vue from "vue";

Vue.config.errorHandler = errorHandler;

function errorHandler(err: Error, vm: Vue, info: string) {
    console.log('in error handler: ', err);
}