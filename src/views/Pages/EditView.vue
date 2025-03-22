<template>
  <breadcrumbs :breadcrumbs="breadcrumbsData" />
  <page-title :text="`Редагувати сторінку`" />
  <FormWrapper @submit="onSubmit">
    <template #form>
      <AppPlainInput v-model="data.key" type="text" label="Ключ" :disabled="true" />
      <AppPlainInput v-model="data.admin_title" type="text" label="Системна назва" />
      <AppPlainInput v-model="data.title" type="text" label="Назва на сайті" />
      <div>
        <h1 class="text-xl font-bold">Наповнення сторінки</h1>
        <div
          v-for="section in Object.keys(data.content)"
          :key="section"
          class="pl-4 border-l border-l-solid border-l-grey-dark-border mb-8"
        >
          <AppPlainInput
            v-model="data.content[section].admin_title"
            type="text"
            label="Назва на секції"
          />
          <div
            v-for="field in Object.keys(data.content[section])"
            :key="field"
            class="pl-4 border-l border-l-solid border-l-grey-dark-border mb-8 my-8"
          >
            <div v-if="field === 'isActive'">
              <span class="block mb-2 text-xs text-gray-500 dark:text-gray-400"
                >Секція відображена на сайті</span
              >
              <AppToggleInput v-model="data.content[section].isActive" />
            </div>
            <div v-if="field !== 'isActive' && field !== 'admin_title'">
              <span class="text-lg font-bold">{{ data.content[section][field].admin_title }}</span>
              <AppPlainInput
                v-model="data.content[section][field].admin_title"
                type="text"
                label="Системна назва"
                class="py-2"
                @change="setKey(`content.${section}.${field}.admin_title`, $event.target.value)"
              />
              <AppPlainInput
                v-if="data.content[section][field].type === 'string'"
                v-model="data.content[section][field].value"
                type="text"
                label="Вміст (текст)"
                class="py-2"
                @change="setKey(`content.${section}.${field}.value`, $event.target.value)"
              />
              <AppTextarea
                v-if="data.content[section][field].type === 'text'"
                v-model="data.content[section][field].value"
                label="Вміст (текст)"
                class="py-2"
                @change="setKey(`content.${section}.${field}.value`, $event.target.value)"
              />
              <AppFileInput
                v-if="data.content[section][field].type === 'image'"
                :defaultImage="data.content[section][field].value"
                v-model="data.content[section][field].value"
                label="Вміст (зображення)"
                class="py-2"
                @change="setKey(`content.${section}.${field}.value`, $event)"
              />
              <AppPlainInput
                v-if="data.content[section][field].type === 'number'"
                v-model="data.content[section][field].value"
                type="text"
                pattern="[0-9]*[.,]?[0-9]*"
                label="Вміст (числове значення типу 99.99 з крапкою або ціле число)"
                class="py-2"
                @change="setKey(`content.${section}.${field}.value`, $event.target.value)"
              />
              <AppSelectInput
                v-if="data.content[section][field].type === 'foreign_key'"
                v-model="data.content[section][field].value"
                :options="booksData"
                label="Вміст (посилання на книгу)"
                class="py-2"
                @change="setKey(`content.${section}.${field}.value`, $event)"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #controls>
      <AppButton type="submit" variant="primary" text="Зберегти" />
    </template>
  </FormWrapper>
</template>
<script setup>
import AppPlainInput from '@/components/atoms/inputs/form/AppPlainInput.vue';
import AppButton from '@/components/atoms/buttons/AppButton.vue';
import AppTextarea from '@/components/atoms/inputs/form/AppTextarea.vue';
import AppSelectInput from '@/components/atoms/inputs/form/AppSelectInput.vue';
import AppFileInput from '@/components/atoms/inputs/form/AppFileInput.vue';
import AppToggleInput from '@/components/atoms/inputs/form/AppToggleInput.vue';
import FormWrapper from '@/components/forms/FormWrapper.vue';
import { usePagesStore } from '@/stores/pages';
import { useBooksStore } from '@/stores/books';
import { reactive, ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const store = usePagesStore();

const booksStore = useBooksStore();

const data = ref({
  key: '',
  admin_title: '',
  title: '',
  content: {},
});

const booksData = ref([]);

const breadcrumbsData = reactive([
  {
    title: 'Сторінки',
    link: { name: 'PagesList' },
  },
  {
    title: route.params.id,
    link: { name: 'PagesEdit', params: { id: route.params.id } },
  },
  {
    title: 'Редагування',
    link: { name: 'PagesEdit', params: { id: route.params.id } },
  },
]);

const editedFormData = ref(new FormData());

function setKey(key, value) {
  editedFormData.value.set(key, value);
}

onBeforeMount(() => {
  booksStore.fetchMany().then((res) => {
    booksData.value = res.map((item) => ({ label: item.title, value: item.id }));
  });

  store.getPage(route.params.id).then((res) => {
    console.log(res);
    data.value = res;
  });
});

function onSubmit() {
  editedFormData.value.entries().forEach(([key, val]) => console.log(key, val));
  // const payload = { ...data.value, id: undefined, key: undefined };
  // store.update({ id: route.params.id, payload });
}
</script>
