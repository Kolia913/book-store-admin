<template>
  <breadcrumbs :breadcrumbs="breadcrumbsData" />
  <div class="pt-2">
    <page-title text="Книги" />
  </div>
  <div class="w-full flex flex-row justify-end items-center">
    <AppButton
      text="Додати"
      variant="primary"
      class="w-24"
      @on-click="$router.push('/books/create')"
    />
  </div>
  <div class="flex flex-col gap-y-8 mt-4">
    <AppTable
      name="books"
      :columns="tableColumns"
      :data="data"
      :options="tableOptions"
      dataPrimaryKey="id"
      @on-edit="(id) => $router.push(`/books/${id}/edit`)"
      @on-delete="onDelete"
    >
      <template #id="{ item }">
        <span>{{ item.id }}</span>
      </template>
      <template #title="{ item }">
        <span>{{ item.title }}</span>
      </template>
      <template #draft="{ item }">
        <AppStatus :status="item.draft" />
      </template>
      <template #is_available="{ item }">
        <AppStatus :status="item.is_available" />
      </template>
      <template #is_on_sale="{ item }">
        <AppStatus :status="item.is_on_sale" />
      </template>
      <template #createdAt="{ item }">
        <span>{{ item.createdAt || '---' }}</span>
      </template>
      <template #updatedAt="{ item }">
        <span>{{ item.updatedAt || '---' }}</span>
      </template>
    </AppTable>
  </div>
</template>
<script setup>
import AppTable from '@/components/general/AppTable.vue';
import AppStatus from '@/components/general/AppStatus.vue';
import AppButton from '@/components/atoms/buttons/AppButton.vue';
import { useBooksStore } from '@/stores/books';
import { onMounted, ref, reactive, shallowRef } from 'vue';

const store = useBooksStore();

const data = ref([]);

const breadcrumbsData = shallowRef([
  {
    title: 'Книги',
    link: { name: 'BooksList' },
  },
  {
    title: 'Список',
    link: { name: 'BooksList' },
  },
]);

const tableColumns = reactive([
  {
    key: 'id',
    title: 'ІД',
  },
  {
    key: 'title',
    title: 'Назва',
  },
  {
    key: 'draft',
    title: 'Чернетка',
  },
  {
    key: 'is_available',
    title: 'В наявності',
  },
  {
    key: 'is_on_sale',
    title: 'На розпродажі',
  },
  {
    key: 'createdAt',
    title: 'Дата створення',
  },
  {
    key: 'updatedAt',
    title: 'Дата редагування',
  },
]);

const tableOptions = reactive({
  mainCol: 'title',
  searchbar: false,
  selectable: false,
  paginated: false,
  pagination: {},
  itemsAlignment: 'start',
  actions: ['edit', 'delete'],
});

onMounted(() => {
  fetchData();
});

function fetchData() {
  store.fetchMany().then((res) => {
    data.value = res.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  });
}

function onDelete(id) {
  store.remove(id).then(() => {
    fetchData();
  });
}
</script>
