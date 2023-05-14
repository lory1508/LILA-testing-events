<template>
  <NConfigProvider preflight-style-disabled>
    <n-notification-provider>
      <TheNavbar/>
      <router-view />
    </n-notification-provider>
  </NConfigProvider>
</template>

<script setup>
import TheNavbar from './components/TheNavbar.vue';
</script>
