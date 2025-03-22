<template>
  <breadcrumbs :breadcrumbs="breadcrumbsData" />
  <div class="pt-2">
    <page-title text="Сторінки" />
  </div>
  <div class="flex flex-col gap-y-8 mt-4">
    <AppTable
      name="pages"
      :columns="tableColumns"
      :data="data"
      :options="tableOptions"
      dataPrimaryKey="key"
      @on-edit="(key) => $router.push(`/pages/${key}/edit`)"
    >
      <template #id="{ item }">
        <span>{{ item.id }}</span>
      </template>
      <template #admin_title="{ item }">
        <span>{{ item.admin_title }}</span>
      </template>
      <template #title="{ item }">
        <span>{{ item.title }}</span>
      </template>
    </AppTable>
  </div>
</template>
<script setup>
import AppTable from '@/components/general/AppTable.vue';
import { usePagesStore } from '@/stores/pages';
import { onMounted, ref, reactive, shallowRef } from 'vue';

const store = usePagesStore();

const data = ref([]);

const breadcrumbsData = shallowRef([
  {
    title: 'Сторінки',
    link: { name: 'PagesList' },
  },
  {
    title: 'Список',
    link: { name: 'PagesList' },
  },
]);

const tableColumns = reactive([
  {
    key: 'id',
    title: 'ІД',
  },
  {
    key: 'admin_title',
    title: 'Системна назва',
  },
  {
    key: 'title',
    title: 'Назва на сайті',
  },
]);

const tableOptions = reactive({
  mainCol: 'admin_title',
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
  store.fetchMany().then((res) => {
    data.value = res.sort((a, b) => a.key.localeCompare(b.key));
  });
}
</script>
