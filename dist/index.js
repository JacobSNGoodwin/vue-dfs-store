import { reactive, readonly, toRefs, inject, provide } from 'vue';

// createStore initializes the store
// The store contains an install() method so we can use it
// with App.use(). This provides any components at a lower
// tree-level to access the store.
const createStore = (config) => {
    const reactiveState = reactive(config.initialState);
    const readonlyState = readonly(reactiveState);
    const { accessorsCreator } = config;
    const mutate = mutatorFunc => {
        mutatorFunc(reactiveState);
        if (config.mutatorHook) {
            config.mutatorHook(readonlyState);
        }
    };
    // for providing state to an accessorCreator
    const get = () => readonlyState;
    const accessors = accessorsCreator(mutate, get);
    const storeAPI = {
        state: toRefs(readonlyState),
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
    const provider = () => provide(storeKey, storeAPI);
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
    const storeAPI = inject(store.storeKey);
    if (!storeAPI) {
        throw new Error(`${store.name} has not been initialized}`);
    }
    return storeAPI;
};

export { createStore, useStore };
