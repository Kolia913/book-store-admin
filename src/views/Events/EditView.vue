<template>
  <breadcrumbs :breadcrumbs="breadcrumbsData" />
  <page-title :text="`Редагувати подію`" />
  <FormWrapper @submit="onSubmit">
    <template #form>
      <AppPlainInput v-model="data.title" type="text" label="Назва" />
      <AppTextarea v-model="data.description" label="Опис" />
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
        <span class="block mb-2 text-xs text-gray-500 dark:text-gray-400">Квитки в наявності</span>
        <AppToggleInput v-model="data.tickets_available" />
      </div>
      <div>
        <span class="block mb-2 text-xs text-gray-500 dark:text-gray-400">Подію завершено</span>
        <AppToggleInput v-model="data.event_end" />
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
import { useEventsStore } from '@/stores/events';
import { reactive, ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import useAppConfig from '@/core/composables/useAppConfig';


const config = useAppConfig();

const route = useRoute();
const store = useEventsStore();

const data = ref({
  id: '',
  title: '',
  description: '',
  tickets_available: false,
  event_end: false,
});

const rewriteImages = ref(false);
const newImages = ref([null]);

const breadcrumbsData = reactive([
  {
    title: 'Події',
    link: { name: 'EventsList' },
  },
  {
    title: route.params.id,
    link: { name: 'EventsEdit', params: { id: route.params.id } },
  },
  {
    title: 'Редагування',
    link: { name: 'EventsEdit', params: { id: route.params.id } },
  },
]);

onBeforeMount(() => {
  store.fetch(route.params.id).then((res) => {
    data.value = res;
  });
});

async function onSubmit() {
  const formData = new FormData();

  // Append text fields
  Object.entries(data.value).forEach(([key, value]) => {
    if (value !== null && value !== undefined && key !== 'id' && key !== 'images' && key !== 'createdAt' && key !== 'updatedAt') {
      formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
    }
  });

  // Append new images as an array
  if (rewriteImages.value) {
    newImages.value.forEach((file) => {
      if (file instanceof File) {
        formData.append('images', file); // Append all files under the same "images" key
      }
    });
  }

  try {
    // Send form data
    await store.update({ id: route.params.id, payload: formData });
  } catch (error) {
    console.error('Error updating event:', error);
  }
}
</script>