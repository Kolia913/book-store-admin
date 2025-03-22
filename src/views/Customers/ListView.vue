<template>
  <breadcrumbs :breadcrumbs="breadcrumbsData" />
  <div class="pt-2">
    <page-title text="Клієнти" />
  </div>
  <div class="flex flex-col gap-y-8 mt-4">
    <AppTable
      name="customers"
      :columns="tableColumns"
      :data="customersData"
      :options="tableOptions"
      dataPrimaryKey="id"
      @on-view="(key) => $router.push(`/customers/${key}/edit`)"
    >
      <template #id="{ item }">
        <span>{{ item.id }}</span>
      </template>
      <template #surname="{ item }">
        <span>{{ item.surname }}</span>
      </template>
      <template #name="{ item }">
        <span>{{ item.name }}</span>
      </template>
      <template #phone="{ item }">
        <span>{{ item.phone }}</span>
      </template>
      <template #email="{ item }">
        <span>{{ item.email }}</span>
      </template>
      <template #createdAt="{ item }">
        <span>{{ dayjs(item.createdAt).format('DD.MM.YYYY HH:mm') }}</span>
      </template>
      <template #updatedAt="{ item }">
        <span>{{ dayjs(item.updatedAt).format('DD.MM.YYYY HH:mm') }}</span>
      </template>
    </AppTable>
  </div>
</template>
<script setup>
import AppTable from '@/components/general/AppTable.vue';
import { useCustomersStore } from '@/stores/customers';
import { onMounted, ref, reactive, shallowRef } from 'vue';
import dayjs from 'dayjs';
const store = useCustomersStore();

const customersData = ref([]);

const breadcrumbsData = shallowRef([
  {
    title: 'Клієнти',
    link: { name: 'CustomersList' },
  },
  {
    title: 'Список',
    link: { name: 'CustomersList' },
  },
]);

const tableColumns = reactive([
  {
    key: 'id',
    title: 'ІД',
  },
  {
    key: 'name',
    title: 'Ім`я',
  },
  {
    key: 'surname',
    title: 'Прізвище',
  },
  {
    key: 'phone',
    title: 'Номер телефону',
  },
  {
    key: 'email',
    title: 'Електронна пошта',
  },
  {
    key: 'createdAt',
    title: 'Створено',
  },
  {
    key: 'updatedAt',
    title: 'Оновлено',
  },
]);

const tableOptions = reactive({
  mainCol: 'phone',
  searchbar: false,
  selectable: false,
  paginated: false,
  pagination: {},
  itemsAlignment: 'start',
  actions: ['view'],
});

onMounted(() => {
  fetchData();
});

function fetchData() {
  store.fetchMany().then((data) => {
    // console.log('data', data);
    customersData.value = data;
  });
}
</script>
