<template>
  <div class="container">
    <h1>Vue DFS Store</h1>
    <h2>A Dead 🤬 Simple Store</h2>

    <nav>
      <router-link v-for="r in appRoutes" :key="r.name" :to="r.path">{{
        r.name
      }}</router-link>
    </nav>

    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'App',
  setup() {
    // counterStore.provider();
    const router = useRouter();
    return {
      appRoutes: router.getRoutes(),
    };
  },
});
</script>

<style scoped>
.container {
  padding: 2em;
  max-width: 700px;
  margin: auto;
}

h1 {
  text-align: center;
  display: block;
  margin: 1em auto 0 auto;
}

h2 {
  text-align: center;
  margin-bottom: 2em;
}

nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  border-bottom: 2px solid #000000;
}

nav > a {
  font-size: 20px;
  margin: 8px;
}

.router-link-active {
  color: rgba(184, 58, 0, 0.75);
}
</style>
