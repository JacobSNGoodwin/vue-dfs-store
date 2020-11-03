'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vue = require('vue');

// createStore initializes the store
// The store contains an install() method so we can use it
// with App.use(). This provides any components at a lower
// tree-level to access the store.
const createStore = (config) => {
    const reactiveState = vue.reactive(config.initialState);
    const { accessorsCreator } = config;
    // TODO - create history tracking / state snapshots
    const mutate = mutatorFunc => {
        mutatorFunc(reactiveState);
        // console.log('New reactive state: ', reactiveState);
    };
    // for providing state to an action creator
    const get = () => vue.readonly(reactiveState);
    const accessors = accessorsCreator(mutate, get);
    const storeAPI = {
        state: vue.toRefs(vue.readonly(reactiveState)),
        accessors,
    };
    // Create symbol from store name
    // This key will be use for injecting store
    // inside of setup functions
    const storeKey = Symbol();
    // for use with App.use(),
    // it will allow providing the store in app.use
    const install = (app) => {
        app.provide(storeKey, storeAPI);
    };
    const provider = () => vue.provide(storeKey, storeAPI);
    const store = {
        name: config.name,
        storeAPI,
        install,
        storeKey,
        provider,
    };
    return store;
};
const useStore = (store) => {
    const storeAPI = vue.inject(store.storeKey);
    if (!storeAPI) {
        throw new Error(`${store.name} has not been initialized}`);
    }
    return storeAPI;
};

exports.createStore = createStore;
exports.useStore = useStore;
