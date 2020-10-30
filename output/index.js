'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vue = require('vue');

// createStore initializes the store
// It returns access to an plugin to be applied in
// App.use(). This provides any components at a lower
// tree-level to access the store. 
// TODO - add to vue context for access in Options API
function createStore(config) {
    const reactiveState = vue.reactive(config.initialState);
    const { actionsCreator, gettersCreator } = config;
    // TODO - create history tracking / state snapshots
    const mutate = mutatorFunc => {
        mutatorFunc(reactiveState);
        // console.log('New reactive state: ', reactiveState);
    };
    // for providing state to an action create
    const get = () => reactiveState;
    const actions = actionsCreator(mutate, get);
    const getters = gettersCreator(reactiveState);
    // Wrap getters in vue's computed
    const computedGetterRefs = Object.assign({});
    for (const key in getters) {
        const getterFunc = getters[key];
        computedGetterRefs[key] = vue.computed(getterFunc);
    }
    const store = {
        state: vue.toRefs(reactiveState),
        actions: actions,
        getters: computedGetterRefs,
    };
    // Create symbol from store name
    // Can we add some sort of unique tag at the end of the name?
    const StoreSymbol = Symbol(name);
    // for providing within setup() instead of a plugin
    // const provider = () => provide(StoreSymbol, state);
    // for use with App.use()
    const provider = {
        install: app => {
            app.provide(StoreSymbol, store);
        },
    };
    // useStore can be used in a setup() of components to inject the store from
    // the provider (installed in App.use()).
    const useStore = () => {
        const store = vue.inject(StoreSymbol);
        if (!store) {
            throw new Error(`${config.name} has not been instantiated!`);
        }
        return store;
    };
    return {
        provider,
        useStore,
    };
}

exports.createStore = createStore;
//# sourceMappingURL=index.js.map
