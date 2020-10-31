<template>
  <h2>Counter</h2>
  <h3>Count: {{ count }}</h3>
  <h3>Double Count: {{ doubleCount }}</h3>
  <button @click="incCount(1)">
    +
  </button>
  <button @click="incCount(-1)">
    -
  </button>
  <div>
    <button @click="clearCount">
      Clear
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import counterStore from '../store/counter';

export default defineComponent({
  name: 'Counter',
  setup() {
    const { state, actions, getters } = counterStore.useStore();

    return {
      count: state.count,
      doubleCount: getters.doubleCount,
      incCount: actions.incCount,
      clearCount: actions.clearCount,
    };
  },
});
</script>
