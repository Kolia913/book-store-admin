<template>
  <breadcrumbs :breadcrumbs="breadcrumbsData" />
  <div class="pt-2">
    <page-title :text="`Налаштування`" />
  </div>
  <AppCard class="p-4 mt-4">
    <div class="flex flex-col justify-start gap-y-6">
      <div
        class="flex flex-col justify-start gap-y-4 border-b last-of-type:border-none pb-8 last-of-type:pb-0 border-gray-200 dark:border-grey-300"
      >
        <h1>Зміна паролю адміністратора</h1>

        <AppPlainInput v-model="prevPassword" type="text" label="Старий пароль" />

        <AppPlainInput v-model="newPassword" type="text" label="Новий пароль" />

        <AppPlainInput v-model="confirmPassword" type="text" label="Підтвердити пароль" />

        <AppButton
          @onClick="changePassword"
          variant="success"
          type="button"
          text="Зберегти"
          class="mt-2"
        />
      </div>
    </div>
  </AppCard>
</template>
<script setup>
import AppCard from '@/components/general/AppCard.vue';
import AppPlainInput from '@/components/atoms/inputs/form/AppPlainInput.vue';
import AppButton from '@/components/atoms/buttons/AppButton.vue';
import useAdminSettingsStore from '@/stores/adminSettings';
import { reactive, ref } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();
const store = useAdminSettingsStore();

const prevPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const breadcrumbsData = reactive([
  {
    title: 'Налаштування',
    link: { name: 'Settings' },
  },
]);

async function changePassword() {
  if (!prevPassword.value || !newPassword.value || !confirmPassword.value) {
    toast.error('Будь ласка заповніть всі поля');
    return;
  }
  if (newPassword.value.length < 6) {
    toast.error('Пароль повинен містити щонайменше 6 символів');
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    toast.error('Паролі не співпадають');
    return;
  }
  const res = await store.changePassword({
    prevPassword: prevPassword.value,
    newPassword: newPassword.value,
  });
  toast.success(res.message || 'Пароль змінено');
}
</script>
