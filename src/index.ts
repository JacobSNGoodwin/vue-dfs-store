import {
  Ref,
  UnwrapRef,
  reactive,
  ToRefs,
  toRefs,
  provide,
  App,
  inject,
  readonly,
  DeepReadonly,
} from 'vue';

// State is a plain old object that can be provided in the config
export type State = Record<string | number | symbol, unknown>;

// Same UnwrapNestedRef, which Vue doesn't export.
// The type that would be returned by Vue's reactive(someState)
export type ReactiveState<T> = T extends Ref ? T : UnwrapRef<T>;
export type ReadonlyState<T> = DeepReadonly<ReactiveState<ReactiveState<T>>>;
export type ReadonlyState2<T> = T extends ReactiveState<infer V>
  ? DeepReadonly<V>
  : DeepReadonly<ReactiveState<T>>;

// Accessors can receive any arguments. Hence disable ESLint for now
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AccessorFunc = (...args: any[]) => unknown;
export type Accessors = Record<string, AccessorFunc>;

// MutatorFunc receives the state for mutating.
// Is there anyway to enforce a syncronous function?
export type MutatorFunc<T> = (state: ReactiveState<T>) => void;

// Mutator will receive access to the Mutator func which receives the state
// All mutations should be syncronous.
// This will allow Mutator to track history or snapshots in later versions.
export type Mutator<T> = (mutator: MutatorFunc<T>) => void;

// GetState used to access the state inside of accessors
export type GetState<T> = () => ReadonlyState<T>;

// AccessorsCreator provides accessors with a
// "mutator" to make state changes and a "get" to access state
// inside of actions.
export type AccessorsCreator<T extends State, U extends Accessors> = (
  mutate: Mutator<T>,
  get: GetState<T>
) => U;

export type MutatorHook<T> = (state: ReadonlyState<T>) => void;

// CreateStoreConfig used to initialize the state
// and define state accessors
export type CreateStoreConfig<T extends State, U extends Accessors> = {
  name: string;
  initialState: T;
  accessorsCreator: AccessorsCreator<T, U>;
  mutatorHook?: MutatorHook<T>;
};

export type StoreAPI<T extends State, U extends Accessors> = {
  readonly state: ToRefs<ReadonlyState<T>>;
  accessors: U;
};

// Store is returned by createStore()
export type Store<T extends State, U extends Accessors> = {
  readonly name: string;
  storeAPI: StoreAPI<T, U>;
  install: (app: App) => void; // makes Store implement Plugin from vue
  readonly storeKey: symbol;
  provider: () => void;
};

// createStore initializes the store
// The store contains an install() method so we can use it
// with App.use(). This provides any components at a lower
// tree-level to access the store.
const createStore = <TState extends State, TAccessors extends Accessors>(
  config: CreateStoreConfig<TState, TAccessors>
): Store<TState, TAccessors> => {
  const reactiveState = reactive(config.initialState);
  const readonlyState = readonly(reactiveState);

  const { accessorsCreator } = config;

  const mutate: Mutator<TState> = mutatorFunc => {
    mutatorFunc(reactiveState);

    if (config.mutatorHook) {
      config.mutatorHook(readonlyState);
    }
  };

  // for providing state to an accessorCreator
  const get = () => readonlyState;

  const accessors = accessorsCreator(mutate, get);

  const storeAPI: StoreAPI<TState, TAccessors> = {
    state: toRefs(readonlyState),
    accessors,
  };

  // Create symbol from store name
  // This key will be use for injecting store
  // inside of setup functions
  const storeKey = Symbol();

  // for use with App.use(),
  // it will allow providing the store in app.use
  const install = (app: App) => {
    app.provide(storeKey, storeAPI);
  };

  const provider = () => provide(storeKey, storeAPI);

  const store: Store<TState, TAccessors> = {
    name: config.name,
    storeAPI,
    install,
    storeKey,
    provider,
  };

  return store;
};

const useStore = <T extends State, U extends Accessors>(
  store: Store<T, U>
): StoreAPI<T, U> => {
  const storeAPI = inject<StoreAPI<T, U>>(store.storeKey);
  if (!storeAPI) {
    throw new Error(`${store.name} has not been initialized}`);
  }

  return storeAPI;
};

export { createStore, useStore };
