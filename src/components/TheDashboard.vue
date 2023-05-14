<template>
  <div class="p-4">
    <DoctorView v-if="store.getters.isUserDoctor" />
    <CounselorsView v-if="store.getters.isUserCounselor" />
    <ReceptionistView v-if="store.getters.isUserReceptionist" />
    <AdminView v-if="store.getters.isUserAdmin" />
  </div>
</template>

<script setup>
/***
 * imports
 */
import DoctorView from '@/views/DoctorView.vue';
import CounselorsView from '@/views/CounselorsView.vue';
import ReceptionistView from '@/views/ReceptionistView.vue';
import AdminView from '@/views/AdminView.vue';
import { useStore } from 'vuex';

/***
 * Data
 */
const store = useStore();

</script>