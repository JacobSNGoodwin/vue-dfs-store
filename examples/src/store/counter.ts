import { createStore } from '../../../dist';

type CounterState = {
  count: number;
};

type CounterAccessors = {
  incCount: (val: number) => void;
  clearCount: () => void;
  multCount: (val: number) => number;
};

const counterStore = createStore<CounterState, CounterAccessors>({
  name: 'counterStore',
  initialState: {
    count: 0,
  },
  accessorsCreator: (mutate, get) => ({
    incCount: (val: number) => mutate(state => (state.count += val)),
    clearCount: () => mutate(state => (state.count = 0)),
    multCount: (val: number) => get().count * val,
  }),
});

export default counterStore;
