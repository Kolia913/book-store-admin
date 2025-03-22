import { defineCrudStore } from '@/core/AppStore';
const useCustomersStore = defineCrudStore('customers', '/customers', {
  omit: [],
  options: {},
});
export { useCustomersStore };
