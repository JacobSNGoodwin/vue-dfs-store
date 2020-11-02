import { Ref, UnwrapRef, ToRefs, ComputedRef, App } from 'vue';
export declare type State = Record<string | number | symbol, unknown>;
export declare type ReactiveState<T> = T extends Ref ? T : UnwrapRef<T>;
export declare type ActionFunc = (...args: any[]) => void;
export declare type Actions = Record<string, ActionFunc>;
export declare type GetterFunc<T> = (ctx?: any) => T;
export declare type Getters = Record<string, GetterFunc<any>>;
export declare type MutatorFunc<T> = (state: ReactiveState<T>) => void;
export declare type Mutator<T> = (mutator: MutatorFunc<T>) => void;
export declare type GetState<T> = () => ReactiveState<T>;
export declare type ActionsCreator<T extends State, U extends Actions> = (mutate: Mutator<T>, get: GetState<T>) => U;
export declare type GettersCreator<T extends State, V extends Getters> = (state: ReactiveState<T>) => V;
export declare type CreateStoreConfig<T extends State, U extends Actions, V extends Getters> = {
    name: string;
    initialState: T;
    actionsCreator: ActionsCreator<T, U>;
    gettersCreator: GettersCreator<T, V>;
};
export declare type ComputedGetterRefs<T extends Getters> = {
    [K in keyof T]: ComputedRef<ReturnType<T[K]>>;
};
export declare type StoreAPI<T extends State, U extends Actions, V extends Getters> = {
    readonly state: ToRefs<ReactiveState<T>>;
    actions: U;
    getters: ComputedGetterRefs<V>;
};
export declare type Store<T extends State, U extends Actions, V extends Getters> = {
    readonly name: string;
    storeAPI: StoreAPI<T, U, V>;
    install: (app: App) => void;
    readonly storeKey: symbol;
    provider: () => void;
};
declare const createStore: <TState extends Record<string | number | symbol, unknown>, TActions extends Record<string, ActionFunc>, TGetters extends Record<string, GetterFunc<any>>>(config: CreateStoreConfig<TState, TActions, TGetters>) => Store<TState, TActions, TGetters>;
declare const useStore: <T extends Record<string | number | symbol, unknown>, U extends Record<string, ActionFunc>, V extends Record<string, GetterFunc<any>>>(store: Store<T, U, V>) => StoreAPI<T, U, V>;
export { createStore, useStore };
