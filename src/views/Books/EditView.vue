<template>
  <breadcrumbs :breadcrumbs="breadcrumbsData" />
  <page-title :text="`Редагувати книгу`" />
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
      <div>
        <span class="block mb-2 text-xs text-gray-500 dark:text-gray-400"
          >Змінити зображення(попередні зображення будуть видалені при збереженні)</span
        >
        <AppToggleInput v-model="rewriteImages" />
      </div>
      <div v-if="!rewriteImages">
        <div v-for="(img, idx) of data.images" :key="idx">
  <div class="pt-4">
    <span>Зображення {{ idx + 1 }}</span>
  </div>
  <img :src="img.startsWith('blob:') ? img : config.baseStorage + img" class="max-w-40 mt-1" />
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
      <div>Відгуки 
        <div>
          <span class="block my-2 text-xs text-gray-500 dark:text-gray-400">Відображати відгуки?</span>
          <AppToggleInput v-model="data.is_feedback_shown" />
        </div>
      </div>
      <span class="block text-xs text-gray-500 dark:text-gray-400"
          >Змінити відгуки(попередні відгуки будуть видалені при збереженні)</span
        >
        <AppToggleInput v-model="rewriteFeedbackImgs" />
        <div v-if="!rewriteFeedbackImgs">
        <div v-for="(img, idx) of data.feedback_images" :key="idx">
          <span>Відгук {{ idx + 1 }}</span>
          <img :src="config.baseStorage + img" class="max-w-40 mt-2" />
        </div>
      </div>
      <div v-else>
        <AppFileInput
          v-for="(img, idx) of newFeedbackImages"
          :key="idx"
          v-model="newFeedbackImages[idx]"
          :defaultImage="null"
          :label="'Відгук ' + (idx + 1)"
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
import AppFileInput from '@/components/atoms/inputs/form/AppFileInput.vue';
import AppToggleInput from '@/components/atoms/inputs/form/AppToggleInput.vue';
import AppButton from '@/components/atoms/buttons/AppButton.vue';
import FormWrapper from '@/components/forms/FormWrapper.vue';
import useAppConfig from '@/core/composables/useAppConfig';
import { useBooksStore } from '@/stores/books';
import { reactive, ref, onBeforeMount, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'

const config = useAppConfig();

const route = useRoute();
const store = useBooksStore();

const rewriteImages = ref(false);
const rewriteFeedbackImgs = ref(false);

const newImages = ref(Array(20).fill(null));
const newFeedbackImages= ref(Array(20).fill(null));



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
  is_feedback_shown: true,
  images: [],
  feedback_images: [],
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




onBeforeMount(() => {
  store.fetch(route.params.id).then((res) => {
    data.value = res;
  });
});

function onSubmit() {
  delete data.value.id;
  delete data.value.images;
  delete data.value.feedback_images;
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
  if (rewriteFeedbackImgs.value) {
    newFeedbackImages.value.forEach((file) => {
      if (file) {
        formData.append('feedback_images', file); // Append multiple files under the same key
      }
    });
  }

  store.update({ id: route.params.id, payload: formData });
}
</script>
