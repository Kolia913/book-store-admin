<template>
  <breadcrumbs :breadcrumbs="breadcrumbsData" />
  <page-title :text="`Створити подію`" />
  <FormWrapper @submit="onSubmit">
    <template #form>
      <AppPlainInput v-model="data.title" type="text" label="Назва" />
      <AppTextarea v-model="data.description" label="Опис" />
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
import AppToggleInput from '@/components/atoms/inputs/form/AppToggleInput.vue';
import AppButton from '@/components/atoms/buttons/AppButton.vue';
import FormWrapper from '@/components/forms/FormWrapper.vue';
import { useEventsStore } from '@/stores/events';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useEventsStore();


const data = ref({
  title: '',
  description: '',
  tickets_available: true,
  event_end: false,
});


const breadcrumbsData = reactive([
  {
    title: 'Події',
    link: { name: 'EventsList' },
  },
  {
    title: 'Створити',
    link: { name: 'EventsCreate' },
  },
]);

async function onSubmit() {
 
  // Send form data
  await store.save(data.value);
  router.back();
}
</script>
