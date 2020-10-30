import {
  Ref,
  UnwrapRef,
  Plugin,
  inject,
  reactive,
  ToRefs,
  toRefs,
  computed,
  ComputedRef,
} from 'vue';

// State is a plain old object that can be provided in the config
type State = Record<string | number | symbol, unknown>;

// Same UnwrapNestedRef, which Vue doesn't export.
// The type that would be returned by Vue's reactive(someState)
type ReactiveState<T> = T extends Ref ? T : UnwrapRef<T>;

// Actions can receive any arguments. Hence disable ESLint for now
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActionFunc = (...args: any[]) => void;
type Actions = Record<string, ActionFunc>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GetterFunc<T> = (ctx?: any) => T; // using unexported type from vue
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Getters = Record<string, GetterFunc<any>>;

// Mutator will receive access to the Mutator func which receives the state
// All mutations should be syncronous.
// This will allow Mutator to track history or snapshots in later versions.
type Mutator<T> = (mutator: MutatorFunc<T>) => void;

// MutatorrFunc receives the state for mutating.
// Is there anyway to enforce a syncronous function?
type MutatorFunc<T> = (state: ReactiveState<T>) => void;

// GetState used to access the state (which is readonly) inside
// of an action
type GetState<T> = () => ReactiveState<T>;

// Actions Creator provides actions with a 
// mutator to make state changes and a get to access state
// inside of actions.
type ActionsCreator<T extends State, U extends Actions> = (
  mutate: Mutator<T>,
  get: GetState<T>
) => U;

// GettersCreator provides our reactive state so that
// methods can be wrapped in vue's "computed," which can
// track and cache changes to reactive objects.
type GettersCreator<T extends State, V extends Getters> = (
  state: ReactiveState<T>
) => V;


// CreateStoreConfig used to initialize the state
// and define actions and getters.
// Name is used to create a symbol for vue's provide
// So keey it unique
// TODO - check "name" uniqueness
type CreateStoreConfig<
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
type ComputedGetterRefs<T extends Getters> = {
  [K in keyof T]: ComputedRef<ReturnType<T[K]>>;
};

// Store is returned by useStore() composable. 
// It will provide Vue Components access to state, actions, and
// getters.
type Store<T extends State, U extends Actions, V extends Getters> = {
  readonly state: ToRefs<ReactiveState<T>>;
  actions: U;
  getters: ComputedGetterRefs<V>;
};

// createStore initializes the store
// It returns access to an plugin to be applied in
// App.use(). This provides any components at a lower
// tree-level to access the store. 
// TODO - add to vue context for access in Options API
export function createStore<
  TState extends State,
  TActions extends Actions,
  TGetters extends Getters
>(config: CreateStoreConfig<TState, TActions, TGetters>) {
  const reactiveState = reactive(config.initialState);

  const { actionsCreator, gettersCreator } = config;

  // TODO - create history tracking / state snapshots
  const mutate: Mutator<TState> = mutatorFunc => {
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

  const store: Store<TState, TActions, TGetters> = {
    state: toRefs(reactiveState),
    actions: actions,
    getters: computedGetterRefs,
  };

  // Create symbol from store name
  // Can we add some sort of unique tag at the end of the name?
  const StoreSymbol = Symbol(name);

  // for providing within setup() instead of a plugin
  // const provider = () => provide(StoreSymbol, state);

  // for use with App.use()
  const provider: Plugin = {
    install: app => {
      app.provide(StoreSymbol, store);
    },
  };

  // useStore can be used in a setup() of components to inject the store from
  // the provider (installed in App.use()).
  const useStore = () => {
    const store = inject<Store<TState, TActions, TGetters>>(StoreSymbol);
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