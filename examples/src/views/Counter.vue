<template>
  <h2>Counter</h2>
  <h3>Count: {{ count }}</h3>

  <h4>Multiplier</h4>
  <input type="number" v-model.number="multiplier" />

  <h3>{{ multiplier }} x Count: {{ multipliedCount }}</h3>

  <div class="buttons">
    <button type="button" @click="incCount(1)">
      +
    </button>
    <button type="button" @click="incCount(-1)">
      -
    </button>
    <button type="button" @click="clearCount">
      Clear
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import counterStore from '../store/counter';

export default defineComponent({
  name: 'Counter',
  setup() {
    const multiplier = ref(1);
    const { state, actions, getters } = counterStore.useStore();

    return {
      count: state.count,
      multipliedCount: getters,
      incCount: actions.incCount,
      clearCount: actions.clearCount,
      multiplier,
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
