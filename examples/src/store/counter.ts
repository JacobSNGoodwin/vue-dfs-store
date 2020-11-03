import { createStore } from '../../../dist';

type CounterState = {
  count: number;
};

type CounterActions = {
  incCount: (val: number) => void;
  clearCount: () => void;
  multCount: (val: number) => number;
};

const counterStore = createStore<CounterState, CounterActions>({
  name: 'counterStore',
  initialState: {
    count: 0,
  },
  actionsCreator: (mutate, get) => ({
    incCount: (val: number) => mutate(state => (state.count += val)),
    clearCount: () => mutate(state => (state.count = 0)),
    multCount: (val: number) => get().count * val,
  }),
});

export default counterStore;
