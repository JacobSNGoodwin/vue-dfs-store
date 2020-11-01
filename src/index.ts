import {
  Ref,
  UnwrapRef,
  reactive,
  ToRefs,
  toRefs,
  computed,
  ComputedRef,
  App,
  inject,
} from 'vue';

// State is a plain old object that can be provided in the config
export type State = Record<string | number | symbol, unknown>;

// Same UnwrapNestedRef, which Vue doesn't export.
// The type that would be returned by Vue's reactive(someState)
export type ReactiveState<T> = T extends Ref ? T : UnwrapRef<T>;

// Actions can receive any arguments. Hence disable ESLint for now
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionFunc = (...args: any[]) => void;
export type Actions = Record<string, ActionFunc>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GetterFunc<T> = (ctx?: any) => T; // using unexported type from vue
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Getters = Record<string, GetterFunc<any>>;

// Mutator will receive access to the Mutator func which receives the state
// All mutations should be syncronous.
// This will allow Mutator to track history or snapshots in later versions.
export type Mutator<T> = (mutator: MutatorFunc<T>) => void;

// MutatorrFunc receives the state for mutating.
// Is there anyway to enforce a syncronous function?
export type MutatorFunc<T> = (state: ReactiveState<T>) => void;

// GetState used to access the state (which is readonly) inside
// of an action
export type GetState<T> = () => ReactiveState<T>;

// Actions Creator provides actions with a
// mutator to make state changes and a get to access state
// inside of actions.
export type ActionsCreator<T extends State, U extends Actions> = (
  mutate: Mutator<T>,
  get: GetState<T>
) => U;

// GettersCreator provides our reactive state so that
// methods can be wrapped in vue's "computed," which can
// track and cache changes to reactive objects.
export type GettersCreator<T extends State, V extends Getters> = (
  state: ReactiveState<T>
) => V;

// CreateStoreConfig used to initialize the state
// and define actions and getters.
// Name is used to create a symbol for vue's provide
// So keey it unique
// TODO - check "name" uniqueness
export type CreateStoreConfig<
  T extends State,
  U extends Actions,
  V extends Getters
> = {
  name: string;
  initialState: T;
  actionsCreator: ActionsCreator<T, U>;
  gettersCreator: GettersCreator<T, V>;
};

// ComputedGetterRefs wraps all getters defined in GettersCreator
// with vue's ComputedRef.
// For typing help, we make sure the keys and return types
// of the the getters is maintained.
export type ComputedGetterRefs<T extends Getters> = {
  [K in keyof T]: ComputedRef<ReturnType<T[K]>>;
};

export type StoreAPI<T extends State, U extends Actions, V extends Getters> = {
  readonly state: ToRefs<ReactiveState<T>>;
  actions: U;
  getters: ComputedGetterRefs<V>;
};

// Store is returned by createStore()
export type Store<T extends State, U extends Actions, V extends Getters> = {
  readonly name: string;
  storeAPI: StoreAPI<T, U, V>;
  install: (app: App) => void; // makes Store implement Plugin from vue
  readonly storeKey: symbol;
};

// createStore initializes the store
// The store contains an install() method so we can use it
// with App.use(). This provides any components at a lower
// tree-level to access the store.
const createStore = <
  TState extends State,
  TActions extends Actions,
  TGetters extends Getters
>(
  config: CreateStoreConfig<TState, TActions, TGetters>
): Store<TState, TActions, TGetters> => {
  const reactiveState = reactive(config.initialState);

  const { actionsCreator, gettersCreator } = config;

  // TODO - create history tracking / state snapshots
  const mutate: Mutator<TState> = (mutatorFunc) => {
    mutatorFunc(reactiveState);
    // console.log('New reactive state: ', reactiveState);
  };

  // for providing state to an action create
  const get = () => reactiveState;

  const actions = actionsCreator(mutate, get);
  const getters = gettersCreator(reactiveState);

  // Wrap getters in vue's computed
  const computedGetterRefs: ComputedGetterRefs<TGetters> = Object.assign({});

  for (const key in getters) {
    const getterFunc = getters[key];
    computedGetterRefs[key] = computed(getterFunc);
  }

  const storeAPI: StoreAPI<TState, TActions, TGetters> = {
    state: toRefs(reactiveState),
    actions: actions,
    getters: computedGetterRefs,
  };

  // Create symbol from store name
  // This key will be use for injecting store
  // inside of setup functions
  const storeKey = Symbol(name);

  // for use with App.use(),
  // it will allow providing the store in app.use
  // TODO: export a provider directly to use down-tree? Add to global context?
  const install = (app: App) => {
    app.provide(storeKey, storeAPI);
  };

  const store: Store<TState, TActions, TGetters> = {
    name: config.name,
    storeAPI,
    install,
    storeKey,
  };

  return store;
};

const useStore = <T extends State, U extends Actions, V extends Getters>(
  store: Store<T, U, V>
): StoreAPI<T, U, V> => {
  const storeAPI = inject<StoreAPI<T, U, V>>(store.storeKey);
  if (!storeAPI) {
    throw new Error(`${store.name} has not been initialized}`);
  }

  return storeAPI;
};

export { createStore, useStore };
