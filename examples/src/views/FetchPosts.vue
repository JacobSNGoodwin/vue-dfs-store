<template>
  <h1>Fetch Data</h1>

  <h2>Filter By UserID</h2>
  <input type="number" v-model.number="selectedUserId" />

  <div class="buttons">
    <button @click="fetchPosts">Fetch Posts</button>
    <button @click="clearPosts">Clear Posts</button>
  </div>

  <Loader v-if="loading" color="#b83a00bf" />
  <div v-else v-for="post in filteredPosts" :key="post.id" class="posts">
    <h3>{{ post.title }}</h3>
    <h4>User: {{ post.userId }}</h4>
    <p>{{ post.body }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useStore } from '../../../dist';
import postStore from '../store/posts';
import Loader from '../components/Loader';

export default defineComponent({
  name: 'FetchPosts',
  components: { Loader },
  setup() {
    const selectedUserId = ref<number | undefined>(undefined);
    const { state, accessors } = useStore(postStore);

    const filteredPosts = computed(() =>
      accessors.getUserPosts(selectedUserId.value)
    );

    return {
      fetchPosts: accessors.fetchPosts,
      clearPosts: accessors.clearPosts,
      loading: state.isFetching,
      selectedUserId,
      filteredPosts,
    };
  },
});
</script>

<style scoped>
.buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.posts {
  margin-top: 24px;
}

.posts > h3,
h4 {
  margin-bottom: 0px;
  margin-top: 8px;
}

p {
  margin-top: 6px;
  font-style: italic;
}
</style>
