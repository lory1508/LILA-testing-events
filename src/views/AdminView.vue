<template>
  <div class="flex flex-col gap-4">
    <n-h1> Informazioni sull'evento</n-h1>

    <n-p>Seleziona l'evento che vuoi visualizzare</n-p>
    <n-select 
      v-model:value="selectedEvent" 
      :options="eventsOptions" 
      @update:value="getEventTests"
      class="w-96" 
    />
    
    <div v-if="selectedEvent">
      <n-card class="shadow-lg shadow-zinc-300">
        <div class="flex flex-row justify-between">
          <n-h2>Accoglienza</n-h2>
        </div>
        <!-- TODO: non serve la tabella basta mostrare l'ultimo numero assegnato -->
        <n-data-table
          :columns="columns"
          :data="receptionists"
          :bordered="true"
        />
      </n-card>
      <n-card class="shadow-lg shadow-zinc-300">
        <div class="flex flex-row justify-between">
          <n-h2>Counseling</n-h2>
        </div>
        <n-data-table
          :columns="columns"
          :data="counselors"
          :bordered="true"
        />
      </n-card>
      <n-card class="shadow-lg shadow-zinc-300">
        <div class="flex flex-row justify-between">
          <n-h2>Medici</n-h2>
        </div>
        <n-data-table
          :columns="columns"
          :data="doctors"
          :bordered="true"
        />
      </n-card>
    </div>
  </div>
</template>

<script setup>
/**
 * imports
 */
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { getUsers } from '@/api/users';
import { getEvents } from '@/api/events';
import { getTestsByEvent } from '@/api/tests';

/**
 * Data
 */
const store = useStore();

const counselors = ref([]);
const doctors = ref([]);
const receptionists = ref([]);

const counselorsTests = ref([]);
const doctorsTests = ref([]);
const receptionistsTests = ref([]);

const selectedEvent = ref(null);
const eventsOptions = ref([]);
const events = ref([]);
const columns = [
  {
    title: 'Nome',
    key: 'name',
  },
  {
    title: "Nome pubblico",
    key: "publicName",
  }
]

/**
 * Methods
 */
const getUsersList = async () => {
  const response = await getUsers();
  response.forEach(user => {
    if(user.role === 'counselor') counselors.value.push(user);
    if(user.role === 'doctor') doctors.value.push(user);
    if(user.role === 'receptionist') receptionists.value.push(user);
  });
}
const getEventsMethod = async () => {
  events.value = await getEvents();
  eventsOptions.value = events.value.map(event => {
    const eventDate = new Date(event.date).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return {
      label: event.location + ' - ' + eventDate,
      value: event.id,
    };
  });
};
const getEventTests = async () => {
  const tests = await getTestsByEvent(selectedEvent.value);
  await getUsersList();

  // tests.forEach(test => {
  //   if(test.)
  // });

  counselorsTests.value
  doctorsTests.value
  receptionistsTests.value

  console.log(tests);
}

/**
 * Lifecycle
 */
onMounted( async () => {
  await getEventsMethod();
});
</script>