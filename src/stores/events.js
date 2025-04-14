import { defineCrudStore } from '@/core/AppStore';
const useEventsStore = defineCrudStore('events', '/events', {
  omit: [],
  options: {},
});
export { useEventsStore };
