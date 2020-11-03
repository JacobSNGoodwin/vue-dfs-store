import { createStore } from '../../../dist';

type CounterState = {
  count: number;
};

type CounterActions = {
  incCount: (val: number) => void;
  multCount: (val: number) => number;
  clearCount: () => void;
};

type CounterGetters = {
  doubleCount: () => number;
};

const counterStore = createStore<CounterState, CounterActions, CounterGetters>({
  name: 'counterStore',
  initialState: {
    count: 0,
  },
  actionsCreator: (mutate, get) => ({
    incCount: (val: number) => mutate(state => (state.count += val)),
    multCount: (val: number) => {
      return get().count * val;
    },
    clearCount: () => mutate(state => (state.count = 0)),
  }),
  gettersCreator: state => ({
    doubleCount: () => state.count * 2,
  }),
});

export default counterStore;
