<template>
  <h2>Fetch Data</h2>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'App',
  setup() {
    const dummy = ref('bla');

    return {
      dummy,
    };
  },
});
</script>
