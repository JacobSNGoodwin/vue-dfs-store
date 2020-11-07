<template>
  <h2>Count: {{ state.count }}</h2>

  <h3>Multiplier</h3>
  <input type="number" v-model.number="multiplier" />

  <h2>Count x {{ multiplier }} = {{ multipliedCount }}</h2>

  <button @click="incCount(1)">
    +
  </button>
  <button @click="incCount(-1)">
    -
  </button>

  <button @click="clearCount">
    Reset Count
  </button>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from '../../../dist';
import counterStore from '../store/counter';

export default defineComponent({
  name: 'Counter',
  setup() {
    const multiplier = ref(0);
    const { state, accessors } = useStore(counterStore);

    const multipliedCount = computed(() =>
      accessors.multCount(multiplier.value)
    );

    return {
      state: state,
      incCount: accessors.incCount,
      clearCount: accessors.clearCount,
      multiplier,
      multipliedCount,
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
