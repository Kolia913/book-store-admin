import { defineCrudStore } from '@/core/AppStore';
const useBooksStore = defineCrudStore('books', '/books', {
  omit: [],
  options: {
    post: {
      'content-type': 'multipart/form-data',
    },
    put: {
      'content-type': 'multipart/form-data',
    },
  },
});
export { useBooksStore };
