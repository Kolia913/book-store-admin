<template>
  <breadcrumbs :breadcrumbs="breadcrumbsData" />
  <div class="pt-2">
    <page-title text="Замовлення" />
  </div>
  <div class="flex flex-col gap-y-8 mt-4">
    <AppTable
      name="purchases"
      :columns="tableColumns"
      :data="purchasesData"
      :options="tableOptions"
      dataPrimaryKey="id"
      @on-view="(key) => $router.push(`/purchases/${key}/edit`)"
    >
      <template #id="{ item }">
        <span>{{ item.id }}</span>
      </template>
      <template #customer_id="{ item }">
        <span>{{ item.customer_id }}</span>
      </template>
      <template #name="{ item }">
        <span>{{ item.Customer.name }} {{ item.Customer.surname }}</span>
      </template>
      <template #phone="{ item }">
        <span>{{ item.Customer.phone }}</span>
      </template>
      <template #total="{ item }">
        <span>{{ item.total }}</span>
      </template>
      <template #payment_type="{ item }">
        <span>{{ item.payment_type }}</span>
      </template>

      <template #createdAt="{ item }">
        <span>{{ dayjs(item.createdAt).format('DD.MM.YYYY HH:mm') }}</span>
      </template>
      <template #payment_details="{ item }">
        <span>{{ item.payment_details }}</span>
      </template>
    </AppTable>
  </div>
</template>
<script setup>
import AppTable from '@/components/general/AppTable.vue';
import { usePurchasesStore } from '@/stores/purchases';
import { onMounted, ref, reactive, shallowRef } from 'vue';
import dayjs from 'dayjs';

const store = usePurchasesStore();

const purchasesData = ref({});

const breadcrumbsData = shallowRef([
  {
    title: 'Замовлення',
    link: { name: 'PurchasesList' },
  },
  {
    title: 'Список',
    link: { name: 'PurchasesList' },
  },
]);

const tableColumns = reactive([
  {
    key: 'id',
    title: 'ІД Замовлення',
  },
  {
    key: 'customer_id',
    title: 'ІД Клієнта',
  },
  {
    key: 'name',
    title: 'Клієнт',
  },
  {
    key: 'phone',
    title: 'Телефон',
  },

  {
    key: 'total',
    title: 'Сума замовлення',
  },
  {
    key: 'payment_type',
    title: 'Тип оплати',
  },

  {
    key: 'createdAt',
    title: 'Створено',
  },
  {
    key: 'payment_details',
    title: 'Коментар',
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
    console.log('data', data);
    purchasesData.value = data;
  });
}
</script>
