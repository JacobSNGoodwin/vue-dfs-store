<template>
  <h1>Dummy App</h1>
  <h2>Count: {{ count }}</h2>
  <h2>Double Count: {{ doubleCount }}</h2>
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
import counterStore from './store/counter';

export default defineComponent({
  name: 'App',
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
