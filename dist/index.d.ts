import { Ref, UnwrapRef, ToRefs, App, DeepReadonly } from 'vue';
export declare type State = Record<string | number | symbol, unknown>;
export declare type ReactiveState<T> = T extends Ref ? T : UnwrapRef<T>;
export declare type ReadonlyState<T> = DeepReadonly<ReactiveState<T>>;
export declare type AccessorFunc = (...args: any[]) => any;
export declare type Accessors = Record<string, AccessorFunc>;
export declare type MutatorFunc<T> = (state: ReactiveState<T>) => void;
export declare type Mutator<T> = (mutator: MutatorFunc<T>) => void;
export declare type GetState<T> = () => ReadonlyState<ReactiveState<T>>;
export declare type AccessorsCreator<T extends State, U extends Accessors> = (mutate: Mutator<T>, get: GetState<T>) => U;
export declare type CreateStoreConfig<T extends State, U extends Accessors> = {
    name: string;
    initialState: T;
    accessorsCreator: AccessorsCreator<T, U>;
};
export declare type StoreAPI<T, U> = {
    readonly state: ToRefs<ReadonlyState<ReactiveState<T>>>;
    accessors: U;
};
export declare type Store<T, U> = {
    readonly name: string;
    storeAPI: StoreAPI<T, U>;
    install: (app: App) => void;
    readonly storeKey: symbol;
    provider: () => void;
};
declare const createStore: <TState extends Record<string | number | symbol, unknown>, TAccessors extends Record<string, AccessorFunc>>(config: CreateStoreConfig<TState, TAccessors>) => Store<TState, TAccessors>;
declare const useStore: <T extends Record<string | number | symbol, unknown>, U extends Record<string, AccessorFunc>>(store: Store<T, U>) => StoreAPI<T, U>;
export { createStore, useStore };
