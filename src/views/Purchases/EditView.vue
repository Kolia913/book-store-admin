<template>
  <breadcrumbs :breadcrumbs="breadcrumbsData" />
  <page-title :text="`Замовлення № ${data.id}`" />
  <FormWrapper>
    <template #form>
      <div class="flex flex-col 2xl:flex-row justify-between">
        <div>
          <div>
            <span class="text-xl font-bold">Покупець</span>
            <div class="flex flex-col gap-2 mt-5">
              <span type="text" label="Email"
                >Ім'я: <strong>{{ data?.Customer?.name }}</strong></span
              >
              <span type="text" label="Email"
                >Прізвище: <strong>{{ data?.Customer?.surname }}</strong></span
              >
              <span type="text" label="Email"
                >Номер телефону: <strong>{{ data?.Customer?.phone }}</strong></span
              >
              <span type="text" label="Email"
                >Електронна пошта: <strong>{{ data?.Customer?.email }}</strong></span
              >
              <span type="text" label="Email"
                >Дата реєстрації:
                <strong>{{ dayjs(data?.createdAt).format('DD.MM.YYYY HH:mm') }}</strong></span
              >
              <span type="text" label="Email"
                >Дата оновлення:
                <strong>{{ dayjs(data?.updatedAt).format('DD.MM.YYYY HH:mm') }}</strong></span
              >
            </div>
          </div>
          <div class="mt-8">
            <span class="text-xl font-bold">Доставка</span>
            <div class="flex flex-col gap-2 mt-5">
              <span type="text" label="Email"
                >Країна: <strong>{{ data?.delivery_data?.country }}</strong></span
              >
              <span type="text" label="Email"
                >Область: <strong>{{ data?.delivery_data?.area }}</strong></span
              >
              <span type="text" label="Email"
                >Місто: <strong>{{ data?.delivery_data?.city }}</strong></span
              >
              <span type="text" label="Email"
                >Вулиця:
                <strong
                  >{{ data?.delivery_data?.street }} {{ data?.delivery_data?.house }}</strong
                ></span
              >
              <span type="text" label="Email"
                >Квартира: <strong>{{ data?.delivery_data?.apartment }}</strong></span
              >
              <span type="text" label="Email"
                >Відділення/Поштомат: <strong>{{ data?.delivery_data?.warehouse }}</strong></span
              >
            </div>
          </div>
        </div>
        <div class="mt-8 2xl:mt-0">
          <span class="text-xl font-bold">Замовлення</span>
          <div v-for="(book, idx) of data.cart_data" :key="idx" class="flex flex-col mt-5">
            <div class="flex gap-4">
              <img :src="config.baseStorage + book?.book?.images[0]" class="max-w-40" />
              <div class="flex flex-col justify-between">
                <div>
                  <p class="uppercase text-lg font-bold">{{ book.book.title }}</p>
                  <span
                    >Ціна: <strong>{{ book.book.price }} ₴</strong>
                  </span>
                  <p>
                    К-сть: <strong>{{ book.qty }} шт.</strong>
                  </p>
                </div>
                <p class="text-2xl">
                  Загалом: <strong>{{ book.qty * book.book.price }} ₴</strong>
                </p>
              </div>
            </div>
            <div class="border-b border-[#636262] mt-5"></div>
          </div>
        </div>
      </div>
    </template>
  </FormWrapper>
</template>
<script setup>
import FormWrapper from '@/components/forms/FormWrapper.vue';
import { reactive, ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
import { usePurchasesStore } from '@/stores/purchases';
import useAppConfig from '@/core/composables/useAppConfig';

const route = useRoute();
const store = usePurchasesStore();
const config = useAppConfig();

const data = ref({});

const breadcrumbsData = reactive([
  {
    title: 'Замовлення',
    link: { name: 'PurchasesList' },
  },
  {
    title: route.params.id,
    link: { name: 'PurchasesEdit', params: { id: route.params.id } },
  },
  {
    title: 'Перегляд',
    link: { name: 'PurchasesEdit', params: { id: route.params.id } },
  },
]);

onBeforeMount(() => {
  store.fetch(route.params.id).then((res) => {
    data.value = res;
  });
});
</script>
