import { defineStore } from 'pinia';
import useRequest from '../core/composables/useRequest';
import { useToast } from 'vue-toastification';

export default defineStore('adminSettings', () => {
  const toast = useToast();
  const request = useRequest({
    baseEndpoint: '/admin/change-password',
  });

  async function changePassword({ newPassword, prevPassword }) {
    try {
      const res = await request.post({
        url: '',
        data: {
          username: 'admin',
          oldPassword: prevPassword,
          newPassword,
        },
      });
      return res.data;
    } catch (err) {
      toast.error(err.message ? err.message : 'Помилка зміни пароля, спробуйте пізніше');
    }
  }
  return {
    changePassword,
  };
});
