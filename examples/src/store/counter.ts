import { createStore } from 'vue-dfs-store';

type CounterState = {
  count: number;
};

type CounterActions = {
  incCount: (val: number) => void;
  clearCount: () => void;
};

type CounterGetters = {
  multCount: () => number;
};

const counterStore = createStore<CounterState, CounterActions, CounterGetters>({
  name: 'counterStore',
  initialState: {
    count: 0,
  },
  actionsCreator: mutate => ({
    incCount: (val: number) => mutate(state => (state.count += val)),
    clearCount: () => mutate(state => (state.count = 0)),
  }),
  gettersCreator: state => ({
    multCount: () => 2 * state.count,
  }),
});

export default counterStore;
