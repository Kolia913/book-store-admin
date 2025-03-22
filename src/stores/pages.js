import { defineCrudStore } from '@/core/AppStore';
import useRequest from '../core/composables/useRequest';
const usePagesStore = defineCrudStore('pages', '/pages', {
  omit: [],
  options: {
    put: {
      'content-type': 'multipart/form-data',
    },
  },
  defineCustomActions: () => {
    const request = useRequest({
      baseEndpoint: '/pages/web',
    });
    async function getPage(key) {
      const page = await request.get({
        url: `/${key}`,
      });

      return page.data;
    }

    return {
      getPage,
    };
  },
});
export { usePagesStore };
