<template>
  <breadcrumbs :breadcrumbs="breadcrumbsData" />
  <page-title :text="`${data.surname} ${data.name} `" />

  <FormWrapper>
    <template #form>
      <div class="flex flex-col gap-4">
        <span type="text" label="Email"
          >Ім'я: <strong>{{ data.name }}</strong></span
        >
        <span type="text" label="Email"
          >Прізвище: <strong>{{ data.surname }}</strong></span
        >
        <span type="text" label="Email"
          >Номер телефону: <strong>{{ data.phone }}</strong></span
        >
        <span type="text" label="Email"
          >Електронна пошта: <strong>{{ data.email }}</strong></span
        >
        <span type="text" label="Email"
          >Дата реєстрації:
          <strong>{{ dayjs(data.createdAt).format('DD.MM.YYYY HH:mm') }}</strong></span
        >
        <span type="text" label="Email"
          >Дата оновлення:
          <strong>{{ dayjs(data.updatedAt).format('DD.MM.YYYY HH:mm') }}</strong></span
        >
      </div>
      <AppButton
        @onClick="deleteUser"
        variant="danger"
        type="button"
        text="Видалити користувача"
        class="mt-2"
      />
    </template>
  </FormWrapper>
</template>
<script setup>
import FormWrapper from '@/components/forms/FormWrapper.vue';
import { reactive, ref, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCustomersStore } from '@/stores/customers';
import AppButton from '@/components/atoms/buttons/AppButton.vue';

import dayjs from 'dayjs';

const route = useRoute();
const $router = useRouter();
const store = useCustomersStore();

const data = ref({});

const breadcrumbsData = reactive([
  {
    title: 'Клієнти',
    link: { name: 'CustomersList' },
  },
  {
    title: route.params.id,
    link: { name: 'CustomersEdit', params: { id: route.params.id } },
  },
  {
    title: 'Перегляд',
    link: { name: 'CustomersEdit', params: { id: route.params.id } },
  },
]);

const deleteUser = () => {
  store.remove(route.params.id).then(() => {
    $router.push({ name: 'CustomersList' });
  });
};

onBeforeMount(() => {
  store.fetch(route.params.id).then((res) => {
    console.log(res);
    data.value = res;
  });
});
</script>
