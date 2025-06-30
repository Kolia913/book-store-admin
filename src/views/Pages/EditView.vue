<template>
  <breadcrumbs :breadcrumbs="breadcrumbsData" />
  <page-title :text="`Редагувати сторінку`" />
  <FormWrapper @submit="onSubmit">
    <template #form>
      <AppPlainInput v-model="data.key" type="text" label="Ключ" :disabled="true" />
      <AppPlainInput
        v-model="data.admin_title"
        @change="setKey('admin_title', $event.target.value)"
        type="text"
        label="Системна назва"
      />
      <AppPlainInput
        v-model="data.title"
        @change="setKey('title', $event.target.value)"
        type="text"
        label="Назва на сайті"
      />
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
            @change="setKey(`content.${section}.admin_title`, $event.target.value)"
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
              <AppToggleInput
                v-model="data.content[section].isActive"
                @change="setKey(`content.${section}.isActive`, $event)"
              />
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
              <div v-if="
                  data.key === 'extended-history' && data.content[section][field].type === 'text'
                " class="pb-2">Текст інтерв'ю</div>
              <QuillEditor
                v-if="
                  (data.key === 'extended-history' && data.content[section][field].type === 'text') || (data.key === 'home' && data.content[section][field].type === 'text') 
                "
                v-model:content="data.content[section][field].value"
                content-type="html"
                :options="quillOptions"
                class="py-2"
                @update:content="(val) => setKey(`content.${section}.${field}.value`, val)"
                
              />
              <AppTextarea
                v-else-if="data.content[section][field].type === 'text'"
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
                @change="
                  (event) => {
                    setKey(`content.${section}.${field}.type`, 'image');
                    setKey(`content.${section}.${field}.value`, event);
                  }
                "
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

              <div v-if="data.content[section][field].type === 'foreign_key'">
                <span>Вміст (посилання на книгу)</span>
                <AppSelectInput
                  dataKey="value"
                  v-model="data.content[section][field].value"
                  :options="booksData"
                  label="label"
                  class="py-2"
                  @change="setKey(`content.${section}.${field}.value`, $event)"
                />
              </div>
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
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

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
const quillOptions = {
  theme: 'snow',
  modules: {
    toolbar: [['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['link']],
  },
};
onBeforeMount(() => {
  booksStore.fetchMany().then((res) => {
    console.log(res.map((item) => ({ label: item.title, value: item.id })));
    console.log(res);
    booksData.value = res.map((item) => ({ label: item.title, value: `${item.id}` }));
  });

  store.getPage(route.params.id).then((res) => {
    console.log(res);
    data.value = res;
  });
});

function onSubmit() {
  let counter = 0;
  editedFormData.value.values().forEach(() => {
    counter++;
  });

  if (counter < 1) {
    return;
  }
  editedFormData.value.set('key', data.value.key);
  editedFormData.value.set('admin_title', data.value.admin_title);
  editedFormData.value.set('title', data.value.title);
  store.update({ id: data.value.id, payload: editedFormData.value });
}
</script>
