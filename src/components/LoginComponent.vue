<template>
  <div class="h-screen w-screen bg-zinc-100 flex items-center justify-center flex-col gap-0">
    <div
      class="md:w-1/4 w-96 p-4 mx-4 px-4 shadow-md shadow-gray-400 gap-4 space-y-4 bg-white rounded-xl"
    >
      <n-image
        width="300"
        src="../../LILA_Cagliari.png"
        preview-disabled
      />
      <div class="flex flex-col gap-4 my-4">
        <n-input
          v-model:value="email"
          name="email"
          placeholder="Email"
          size="large"
          round
        />
        <n-input
          v-model:value="password"
          type="password"
          show-password-on="click"
          placeholder="Password"
          size="large"
          @keyup.enter="login"
          round
        />
      </div>
      <n-button strong round type="primary" size="large"
        class="w-full"
        @click="login"
      >
        Login
      </n-button>
      <n-alert
        v-if="loginFailed"
        title="Login non riuscito"
        type="error"
        class="my-4"
      >
        Email o password errati
      </n-alert>
    </div>
  </div>
</template>

<script setup>
/***
 * imports
 */
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { loginUser } from '@/api/users';
import { getEvents } from '@/api/events';
import Md5 from 'md5';
 
import axios from "axios";
/***
 * Data
 */
const password = ref('');
const email = ref('');
const router = useRouter();
const loginFailed = ref(false);
const store = useStore();

/***
 * Methods
 */
const login = async () => {
  try{
    loginFailed.value = false;
    const userRes = await loginUser(email.value, Md5(password.value));
    if(userRes.status == 200){
      store.commit('setUser', userRes.user);
      router.push('/dashboard');
    } else {
      loginFailed.value = true;
      throw new Error('Login failed');
    }
  } catch (e) {
    loginFailed.value = true;
    console.error(e);
  }
}

onMounted(async () => {
  // await testAPI();
  // const events = await getEvents();
  // console.log(events);
}); 
</script>
