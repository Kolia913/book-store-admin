<template>
  <DesktopAside
    :menuItems="menuItems"
    @toggleMenuGroup="toggleMenuGroup"
    :title="'Панель адміністратора'"
    class="lg:block hidden"
  />
  <MobileAside
    :menuItems="menuItems"
    :isMobileAsideOpen="isMobileAsideOpen"
    @toggleMenuGroup="toggleMenuGroup"
    @toggleMobileAside="settingsStore.toggleMobileAside"
    :title="'Панель адміністратора'"
    class="lg:hidden block"
  />
</template>
<script setup>
import DesktopAside from './DesktopAside.vue';
import MobileAside from './MobileAside.vue';

import useSettingsStore from '@/stores/settings';
import useMenu from '@/core/composables/useMenu';
import { computed } from 'vue';

const settingsStore = useSettingsStore();
const { menu: menuItems } = useMenu();
const isMobileAsideOpen = computed(() => settingsStore.isMobileAsideOpen);
function toggleMenuGroup(groupId) {
  menuItems.value = menuItems.value.map((item) => {
    if (item.id === groupId) {
      return {
        ...item,
        isOpen: !item.isOpen,
      };
    }
    return item;
  });
}
</script>
