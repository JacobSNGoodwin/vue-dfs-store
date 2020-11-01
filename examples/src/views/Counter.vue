<template>
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
import { useStore } from 'vue-dfs-store';
import counterStore from '../store/counter';

export default defineComponent({
  name: 'Counter',
  setup() {
    const { state, actions, getters } = useStore(counterStore);

    return {
      count: state.count,
      doubleCount: getters.doubleCount,
      incCount: actions.incCount,
      clearCount: actions.clearCount,
    };
  },
});
</script>

<style scoped>
.buttons {
  display: flex;
  justify-content: center;
}
</style>
