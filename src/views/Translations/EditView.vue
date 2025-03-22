<template>
  <breadcrumbs :breadcrumbs="breadcrumbsData" />
  <page-title :text="`Редагувати переклад`" />
  <FormWrapper @submit="onSubmit">
    <template #form>
      <AppPlainInput v-model="data.key" type="text" label="Ключ" :disabled="true" />
      <AppPlainInput v-model="data.text_ua" type="text" label="Текст українською" />
    </template>
    <template #controls>
      <AppButton type="submit" variant="primary" text="Зберегти" />
    </template>
  </FormWrapper>
</template>
<script setup>
import AppPlainInput from '@/components/atoms/inputs/form/AppPlainInput.vue';
import AppButton from '@/components/atoms/buttons/AppButton.vue';
import FormWrapper from '@/components/forms/FormWrapper.vue';
import { useTranslationsStore } from '@/stores/translations';
import { reactive, ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const store = useTranslationsStore();

const data = ref({
  id: '',
  key: '',
  text_ua: '',
});

const breadcrumbsData = reactive([
  {
    title: 'Переклади',
    link: { name: 'TranslationsList' },
  },
  {
    title: route.params.id,
    link: { name: 'TranslationsEdit', params: { id: route.params.id } },
  },
  {
    title: 'Редагування',
    link: { name: 'TranslationsEdit', params: { id: route.params.id } },
  },
]);

onBeforeMount(() => {
  store.fetch(route.params.id).then((res) => {
    console.log(res);
    data.value = res;
  });
});

function onSubmit() {
  const payload = { ...data.value, id: undefined, key: undefined };
  store.update({ id: route.params.id, payload });
}
</script>
