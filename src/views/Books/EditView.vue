<template>
  <breadcrumbs :breadcrumbs="breadcrumbsData" />
  <page-title :text="`Редагувати книгу`" />
  <FormWrapper @submit="onSubmit">
    <template #form>
      <AppPlainInput v-model="data.title" type="text" label="Назва" />
      <AppPlainInput v-model="data.author" type="text" label="Автор" />
      <AppPlainInput v-model="data.page_desc_caption" type="text" label="Текст перед полем опис" />
      <AppTextarea v-model="data.description" label="Опис" />
      <span>Ціни потрібно вводити у форматі 99.99(через крапку)</span>
      <AppPlainInput v-model="data.price" type="text" pattern="[0-9]*[.,]?[0-9]*" label="Ціна" />
      <AppPlainInput
        v-model="data.price_with_signature"
        type="text"
        pattern="[0-9]*[.,]?[0-9]*"
        label="Ціна з підписом"
      />
      <AppPlainInput
        v-model="data.discount_price"
        type="text"
        pattern="[0-9]*[.,]?[0-9]*"
        label="Ціна зі знижкою"
        :disabled="!data.is_on_sale"
      />
      <AppPlainInput
        v-model="data.discount_price_with_signature"
        type="text"
        pattern="[0-9]*[.,]?[0-9]*"
        label="Ціна з підписом зі знижкою"
        :disabled="!data.is_on_sale"
      />
      <div>
        <span class="block mb-2 text-xs text-gray-500 dark:text-gray-400"
          >Змінити зображення(попередні зображення будуть видалені при збереженні)</span
        >
        <AppToggleInput v-model="rewriteImages" />
      </div>
      <div v-if="!rewriteImages">
        <div v-for="(img, idx) of data.images" :key="idx">
          <span>Зображення {{ idx + 1 }}</span>
          <img :src="config.baseStorage + img" class="max-w-40 mt-2" />
        </div>
      </div>
      <div v-else>
        <AppFileInput
          v-for="(img, idx) of newImages"
          :key="idx"
          v-model="newImages[idx]"
          :defaultImage="null"
          :label="idx !== 0 ? 'Зображення ' + (idx + 1) : 'Головне зображення'"
        />
      </div>
    </template>
    <template #controls>
      <div>
        <span class="block mb-2 text-xs text-gray-500 dark:text-gray-400">Чернетка</span>
        <AppToggleInput v-model="data.draft" />
      </div>
      <div>
        <span class="block mb-2 text-xs text-gray-500 dark:text-gray-400">В наявності</span>
        <AppToggleInput v-model="data.is_available" />
      </div>
      <div>
        <span class="block mb-2 text-xs text-gray-500 dark:text-gray-400">Розпродаж</span>
        <AppToggleInput v-model="data.is_on_sale" />
      </div>
      <AppButton type="submit" variant="primary" text="Зберегти" />
    </template>
  </FormWrapper>
</template>
<script setup>
import AppPlainInput from '@/components/atoms/inputs/form/AppPlainInput.vue';
import AppTextarea from '@/components/atoms/inputs/form/AppTextarea.vue';
import AppFileInput from '@/components/atoms/inputs/form/AppFileInput.vue';
import AppToggleInput from '@/components/atoms/inputs/form/AppToggleInput.vue';
import AppButton from '@/components/atoms/buttons/AppButton.vue';
import FormWrapper from '@/components/forms/FormWrapper.vue';
import useAppConfig from '@/core/composables/useAppConfig';
import { useBooksStore } from '@/stores/books';
import { reactive, ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';

const config = useAppConfig();

const route = useRoute();
const store = useBooksStore();

const rewriteImages = ref(false);
const newImages = ref([null, null, null, null]);

const data = ref({
  id: '',
  draft: false,
  author: '',
  title: '',
  page_desc_caption: '',
  description: '',
  is_available: false,
  is_on_sale: false,
  price: '',
  price_with_signature: '',
  discount_price: '',
  discount_price_with_signature: '',
});

const breadcrumbsData = reactive([
  {
    title: 'Книги',
    link: { name: 'BooksList' },
  },
  {
    title: route.params.id,
    link: { name: 'BooksEdit', params: { id: route.params.id } },
  },
  {
    title: 'Редагування',
    link: { name: 'BooksEdit', params: { id: route.params.id } },
  },
]);

onBeforeMount(() => {
  store.fetch(route.params.id).then((res) => {
    data.value = res;
  });
});

function onSubmit() {
  delete data.value.id;
  delete data.value.images;
  delete data.value.createdAt;
  delete data.value.updatedAt;

  const formData = new FormData();
  Object.entries(data.value).forEach(([key, value]) => {
    if (value) {
      formData.append(key, value); // Ensure no `undefined` values
    }
  });
  if (rewriteImages.value) {
    newImages.value.forEach((file) => {
      if (file) {
        formData.append('images', file); // Append multiple files under the same key
      }
    });
  }

  store.update({ id: route.params.id, payload: formData });
}
</script>
