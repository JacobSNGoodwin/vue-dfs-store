<template>
  <h2>Counter</h2>
  <h3>Count: {{ count }}</h3>

  <!-- <h4>Multiplier</h4>
  <input type="number" v-model.number="multiplier" /> -->

  <!-- <h3>{{ multiplier }} x Count: {{ multipliedCount }}</h3> -->

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
import { defineComponent } from 'vue';
import counterStore from '../store/counter';

export default defineComponent({
  name: 'Counter',
  setup() {
    // const multiplier = ref(1);
    const { state, actions } = counterStore.useStore();

    // const multipliedValue = computed(
    //   multiplier => multiplier * state.count.value
    // );

    return {
      count: state.count,
      incCount: actions.incCount,
      clearCount: actions.clearCount,
      // multiplier,
      // multipliedValue,
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
