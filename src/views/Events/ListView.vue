<template>
  <breadcrumbs :breadcrumbs="breadcrumbsData" />
  <div class="pt-2">
    <page-title text="Події" />
  </div>
  <div class="w-full flex flex-row justify-end items-center">
    <AppButton
      text="Додати"
      variant="primary"
      class="w-24"
      @on-click="$router.push('/events/create')"
    />
  </div>
  <div class="flex flex-col gap-y-8 mt-4">
    <AppTable
      name="books"
      :columns="tableColumns"
      :data="data"
      :options="tableOptions"
      dataPrimaryKey="id"
      @on-edit="(id) => $router.push(`/events/${id}/edit`)"
      @on-delete="onDelete"
    >
      <template #id="{ item }">
        <span>{{ item.id }}</span>
      </template>
      <template #title="{ item }">
        <span>{{ item.title }}</span>
      </template>
      <template #tickets_available="{ item }">
        <AppStatus :status="item.tickets_available" />
      </template>
      <template #event_end="{ item }">
        <AppStatus :status="item.event_end" />
      </template>
      <template #createdAt="{ item }">
        <span>{{ dayjs(item.createdAt).format('DD.MM.YYYY HH:mm') || '---' }}</span>
      </template>
      <template #updatedAt="{ item }">
        <span>{{ dayjs(item.updatedAt).format('DD.MM.YYYY HH:mm') || '---' }}</span>
      </template>
    </AppTable>
  </div>
</template>
<script setup>
import AppTable from '@/components/general/AppTable.vue';
import AppStatus from '@/components/general/AppStatus.vue';
import AppButton from '@/components/atoms/buttons/AppButton.vue';
import {useEventsStore} from '@/stores/events';
import { onMounted, ref, reactive, shallowRef } from 'vue';
import dayjs from 'dayjs';

const store = useEventsStore();

const data = ref([]);

const breadcrumbsData = shallowRef([
  {
    title: 'Події',
    link: { name: 'EventsList' },
  },
  {
    title: 'Список',
    link: { name: 'EventsList' },
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
    key: 'tickets_available',
    title: 'Квитки в наявності',
  },
  {
    key: 'event_end',
    title: 'Завершено',
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
    data.value = res.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  });
}

function onDelete(id) {
  store.remove(id).then(() => {
    fetchData();
  });
}
</script>
