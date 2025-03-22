<template>
  <label>
    <div class="flex w-full">
      <div class="flex justify-start items-end gap-2 w-full">
        <AppPlainInput
          type="text"
          v-model="filename"
          :label="label"
          class="w-full"
          :disabled="true"
        />
        <AppButton
          text="Завантажити"
          type="button"
          variant="outline"
          @onClick="choiceNewImg()"
          class="min-w-[100px]"
        />
      </div>
    </div>
    <img v-if="defaultImage && !preview" :src="config.baseStorage + model" class="max-w-40 mt-2" />
    <img v-if="preview.length" :src="preview" class="max-w-40 mt-2" />
    <input ref="dialog" type="file" id="file" style="display: none" @change="uploadFiles" />
  </label>
</template>
<script setup>
import useAppConfig from '@/core/composables/useAppConfig';
import AppButton from '@/components/atoms/buttons/AppButton.vue';
import { ref, defineModel, watch, defineEmits } from 'vue';
import AppPlainInput from './AppPlainInput.vue';

const config = useAppConfig();

const emit = defineEmits(['change']);

const filename = ref('');
const preview = ref('');

const dialog = ref();

defineProps(['label', 'defaultImage']);

const model = defineModel();

watch(model, async (value) => {
  filename.value = value?.name;
  if (value) {
    emit('change', value);
  }
});

const choiceNewImg = () => {
  console.log(dialog.value);
  dialog.value.click();
};

async function uploadFiles(files) {
  model.value = files.target.files[0];
  preview.value = await createPreview(files.target.files[0]);
}

function createPreview(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
</script>
