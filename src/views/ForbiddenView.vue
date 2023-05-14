<template>
  <n-result
    status="403"
    title="403 Accesso vietato"
    description="Non sei autorizzato ad accedere a questa pagina."
    class="p-8"
  >
    <template #footer>
      <n-button @click="toAllowedPage">Torna alla pagina disponibile</n-button>
    </template>
  </n-result>
</template>

<script setup>
/**
 * imports
 */
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

/**
 * Data
 */
const store = useStore();
const router = useRouter();

const user = store.getters.user;

/**
 * Methods
 */
const toAllowedPage = () => {
  router.push({ name: 'Dashboard' });
};
</script>