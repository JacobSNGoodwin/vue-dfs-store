<template>
  <h1>Vue DFS Store</h1>

  <router-link :to="{ name: 'counter' }">Counter</router-link>
  <router-link :to="{ name: 'fetchData' }">Fetch Data</router-link>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
});
</script>
