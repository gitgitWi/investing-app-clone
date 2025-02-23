<template>
  <form method="post" class="area login-form" @submit.prevent="loginSubmitHandler">
    <Label :forId="'login-email'" class="login-form-label">Email</Label>
    <Input id="login-email" :type="'email'" :newValue="email" @change-input-handler="changeEmailHandler" autofocus required />
    <Label :forId="'login-password'" class="login-form-label">Password</Label>
    <Input id="login-password" :type="'password'" :newValue="password" @change-input-handler="changePWHandler" required />
    <div class="user-buttons">
      <Link :href="'/user/join'" :name="'가입하기'" />
      <Button type="submit" class="user-sign-button" :class="{ isSubmitting }">로그인 </Button>
    </div>
  </form>
</template>

<script lang="ts">
import Vue from 'vue';
import Label from '@/components/atoms/Label.vue';
import Input from '@/components/atoms/Input.vue';
import Link from '@/components/atoms/RouterLink.vue';
import Button from '@/components/atoms/Button.vue';
import { createNamespacedHelpers } from 'vuex';
import { StoreNames } from '@/store';

const { mapActions } = createNamespacedHelpers(StoreNames.Auth);

export default Vue.extend({
  components: { Label, Input, Link, Button },

  data() {
    return {
      email: '',
      password: '',
      isSubmitting: false,
    };
  },

  methods: {
    ...mapActions(['postLogin']),
    changeEmailHandler(e) {
      this.email = e.target.value;
    },

    changePWHandler(e) {
      this.password = e.target.value;
    },

    async loginSubmitHandler() {
      this.isSubmitting = true;
      const isSuccess = await this.postLogin({ email: this.email, password: this.password });
      this.isSubmitting = false;
      /** @todo UI 실패 처리 */
      if (!isSuccess) return alert('로그인 실패');
      this.$router.push('/user');
    },
  },
});
</script>

<style lang="scss" scoped>
.login-form {
  &-label {
    padding: 0 15px;
  }

  .user-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;

    .router-link,
    .user-sign-button {
      width: 120px;
      color: $grey-100;
    }

    .router-link {
      background-color: $blue-500;
    }

    .user-sign-button {
      position: relative;
      background-color: $green-500;

      &.isSubmitting {
        /** background */
        &:before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          cursor: progress;
          border-radius: $border-radius-10;
          background-color: $green-500;
        }

        /** spinning circle */
        &:after {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 20px;
          border: 2px solid $shallow-blue;
          border-right-color: $green-100;
          animation: spinner 1s cubic-bezier(0.74, 0.16, 0.55, 0.76) infinite;
        }
      }
    }
  }
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
