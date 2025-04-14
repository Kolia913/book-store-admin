<template>
  <breadcrumbs :breadcrumbs="breadcrumbsData" />
  <page-title :text="`Редагувати подію`" />
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
import { reactive, ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';


const route = useRoute();
const store = useEventsStore();


const data = ref({
  id: '',
  title: '',
  description: '',
  tickets_available: false,
  event_end: false,
});

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

function onSubmit() {
  delete data.value.id;
  delete data.value.images;
  delete data.value.createdAt;
  delete data.value.updatedAt;


  store.update({ id: route.params.id, payload: data.value });
}
</script>
