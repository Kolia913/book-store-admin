import { defineCrudStore } from '@/core/AppStore';
const usePurchasesStore = defineCrudStore('purchases', '/purchases', {
  omit: [],
  options: {},
});
export { usePurchasesStore };
