<template>
  <breadcrumbs :breadcrumbs="breadcrumbsData" />
  <div class="pt-2">
    <page-title text="Переклади" />
  </div>
  <div class="flex flex-col gap-y-8 mt-4">
    <AppTable
      name="news"
      :columns="tableColumns"
      :data="translationsData"
      :options="tableOptions"
      dataPrimaryKey="key"
      @on-edit="(key) => $router.push(`/translations/${key}/edit`)"
    >
      <template #key="{ item }">
        <span>{{ item.key }}</span>
      </template>
      <template #text_ua="{ item }">
        <span>{{ item.text_ua }}</span>
      </template>
    </AppTable>
  </div>
</template>
<script setup>
import AppTable from '@/components/general/AppTable.vue';
import { useTranslationsStore } from '@/stores/translations';
import { onMounted, ref, reactive, shallowRef } from 'vue';

const store = useTranslationsStore();

const translationsData = ref([]);

const breadcrumbsData = shallowRef([
  {
    title: 'Переклади',
    link: { name: 'TranslationsList' },
  },
  {
    title: 'Список',
    link: { name: 'TranslationsList' },
  },
]);

const tableColumns = reactive([
  {
    key: 'key',
    title: 'Ключ',
  },
  {
    key: 'text_ua',
    title: 'Текст українською',
  },
]);

const tableOptions = reactive({
  mainCol: 'text_ua',
  searchbar: false,
  selectable: false,
  paginated: false,
  pagination: {},
  itemsAlignment: 'start',
  actions: ['edit'],
});

onMounted(() => {
  fetchData();
});

function fetchData() {
  store.fetchMany().then((data) => {
    console.log('data', data);
    translationsData.value = Object.entries(data).map(([key, val]) => ({ key, text_ua: val }));
  });
}
</script>
