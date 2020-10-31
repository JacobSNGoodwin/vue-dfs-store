<template>
  <h2>Fetch Data</h2>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import counterStore from '../store/counter';

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
