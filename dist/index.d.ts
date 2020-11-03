import { Ref, UnwrapRef, ToRefs, App } from 'vue';
export declare type State = Record<string | number | symbol, unknown>;
export declare type ReactiveState<T> = T extends Ref ? T : UnwrapRef<T>;
export declare type ActionFunc = (...args: any[]) => any;
export declare type Actions = Record<string, ActionFunc>;
export declare type MutatorFunc<T> = (state: ReactiveState<T>) => void;
export declare type Mutator<T> = (mutator: MutatorFunc<T>) => void;
export declare type GetState<T> = () => ReactiveState<T>;
export declare type ActionsCreator<T extends State, U extends Actions> = (mutate: Mutator<T>, get: GetState<T>) => U;
export declare type CreateStoreConfig<T extends State, U extends Actions> = {
    name: string;
    initialState: T;
    actionsCreator: ActionsCreator<T, U>;
};
export declare type StoreAPI<T extends State, U extends Actions> = {
    readonly state: ToRefs<ReactiveState<T>>;
    actions: U;
};
export declare type Store<T extends State, U extends Actions> = {
    readonly name: string;
    storeAPI: StoreAPI<T, U>;
    install: (app: App) => void;
    readonly storeKey: symbol;
    provider: () => void;
};
declare const createStore: <TState extends Record<string | number | symbol, unknown>, TActions extends Record<string, ActionFunc>>(config: CreateStoreConfig<TState, TActions>) => Store<TState, TActions>;
declare const useStore: <T extends Record<string | number | symbol, unknown>, U extends Record<string, ActionFunc>>(store: Store<T, U>) => StoreAPI<T, U>;
export { createStore, useStore };
