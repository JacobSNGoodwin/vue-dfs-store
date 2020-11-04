import { createStore } from '../../../dist';
import { sleep } from '../util';

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type PostState = {
  isFetching: boolean;
  posts: Post[];
  error: Error | undefined;
};

type PostAccessors = {
  fetchPosts: () => Promise<void>;
  clearPosts: () => void;
  getUserPosts: (userId: number | undefined) => Post[];
};

const postStore = createStore<PostState, PostAccessors>({
  name: 'postStore',
  initialState: {
    isFetching: false,
    posts: [],
    error: undefined,
  },
  accessorsCreator: (mutate, get) => ({
    fetchPosts: async () => {
      mutate(state => {
        state.isFetching = true;
        state.error = undefined;
      });

      try {
        await sleep(700); // artificial delay to see loader
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/posts'
        );
        const fetchedPosts = (await response.json()) as Post[];
        mutate(state => {
          state.posts = fetchedPosts;
        });
      } catch (e) {
        mutate(state => {
          state.posts = [];
        });
        if (e instanceof Error) {
          mutate(state => {
            state.error = e;
          });
        } else {
          mutate(state => {
            state.error = new Error('Unknown error fetching data');
          });
        }
      } finally {
        mutate(state => {
          state.isFetching = false;
        });
      }
    },
    clearPosts: () => {
      mutate(state => (state.posts = []));
    },
    getUserPosts: (userId: number | undefined): Post[] => {
      if (!userId) {
        return get().posts;
      }
      return get().posts.filter(post => post.userId === userId);
    },
  }),
});

export default postStore;
