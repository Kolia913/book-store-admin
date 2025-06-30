<template>
  <breadcrumbs :breadcrumbs="breadcrumbsData" />
  <page-title :text="`Створити книгу`" />
  <FormWrapper @submit="onSubmit">
    <template #form>
      <AppPlainInput v-model="data.title" type="text" label="Назва" />
      <AppPlainInput v-model="data.author" type="text" label="Автор" />
      <AppPlainInput v-model="data.page_desc_caption" type="text" label="Текст перед полем опис" />
  
      <div ref="editorRef" label="Опис" ></div>
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
      <AppFileInput
        v-for="(img, idx) of newImages"
        :key="idx"
        v-model="newImages[idx]"
        :defaultImage="null"
        :label="idx !== 0 ? 'Зображення ' + (idx + 1) : 'Головне зображення'"
      />
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
import AppFileInput from '@/components/atoms/inputs/form/AppFileInput.vue';
import AppToggleInput from '@/components/atoms/inputs/form/AppToggleInput.vue';
import AppButton from '@/components/atoms/buttons/AppButton.vue';
import FormWrapper from '@/components/forms/FormWrapper.vue';
import { useBooksStore } from '@/stores/books';
import { reactive, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'

const router = useRouter();
const route = useRoute()
const store = useBooksStore();

const newImages = ref(Array(20).fill(null)); // Ensure reactivity for 20 images

const data = ref({
  draft: true,
  author: '',
  title: '',
  page_desc_caption: 'Опис',
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
    title: 'Створити',
    link: { name: 'BooksCreate' },
  },
]);
const editorRef = ref(null)

onMounted(() => {
  const quill = new Quill(editorRef.value, {
    theme: 'snow',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link']
      ]
    }
  })

  store.fetch(route.params.id).then((res) => {
    data.value = res;
    quill.root.innerHTML = res.description || '';
  })

  quill.on('text-change', () => {
    data.value.description = quill.root.innerHTML
  })
})


async function onSubmit() {
  const formData = new FormData();

  // Append text fields
  Object.entries(data.value).forEach(([key, value]) => {
    if (value) {
      formData.append(key, value); // Ensure no `undefined` values
    }
  });

  newImages.value.forEach((file) => {
    if (file) {
      formData.append('images', file); // Append multiple files under the same key
    }
  });

  // Send form data
  await store.save(formData);
  router.back();
}
</script>
