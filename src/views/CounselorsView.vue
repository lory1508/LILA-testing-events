<template>
  <div class="flex flex-col gap-4 justify-center items-center p-4">
    <!-- start counseling -->
    <n-h1>{{ user.name }}</n-h1>
    <div v-if="step === 0" class="flex flex-col justify-center text-center gap-8">
      <n-h2>Non hai un colloquio in corso</n-h2>
      <n-select v-show="!event.length" v-model:value="selectedEvent" :options="eventsOptions" @update:value="checkForTests" class="w-96" />
      
      <div>
        <span>Indica la stanza nella quale stai ricevendo</span>
        <n-input v-model:value="room" placeholder="Inserisci il numero della stanza" class="w-96" />
      </div>

      <n-alert v-if="!selectedEvent" title="Evento non selezionato" type="warning" class="w-96">
        Ricordati di selezionare un evento
      </n-alert>
      
      <n-button 
        type="primary"
        class="py-8 shadow-md shadow-gray-400 w-96 h-24 justify-center items-center border-2 border-emerald-400
          hover:scale-105 hover:shadow-emerald-400 transition duration-200"
        @click="startNewCounseling"
        :disabled="!selectedEvent || noOneWaitingForCounseling"
      >
        <span class="text-xl">Inizia nuovo colloquio</span>
      </n-button>
      <pre>{{ noOneWaitingForCounseling }}</pre>
      <n-tag v-if="noOneWaitingForCounseling" type="warning" strong size="large" class="justify-center text-center">Nessuno in attesa di colloquio</n-tag>
    </div>

    <!-- Counseling ongoing -->
    <div v-if="step === 1" class="flex flex-col justify-center text-center">
      <n-h2>
        Stai parlando con il numero: 
        <n-tag size="large" type="success">
          <span class="text-2xl p-4"> {{currentTest.customerId}} </span>
        </n-tag>
      </n-h2>
      <n-button 
        type="primary"
        class="py-8 shadow-md shadow-gray-400 w-96 h-24 justify-center items-center border-2 border-emerald-400
          hover:scale-105 hover:shadow-emerald-400 transition duration-200"
        @click="endCounseling"
      >
        <span class="text-xl">Termina il colloquio</span>
      </n-button>
    </div>
  </div>
</template>

<script setup>
/**
 * Imports
 */
import { onMounted, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { getNextTestToLine, updateTest } from '@/api/tests';
import { getEvents } from '@/api/events';

/***
 * Data
 */
const step = ref(0);
const store = useStore();
const user = store.getters.user;
let event = store.getters.event;

const room = ref('');
const events = ref([]);
const eventsOptions = ref([]);
const selectedEvent = ref(null);
const currentTest = ref({});

const testsWaitingForCounseling = ref([]);

/**
 * Computed
 */
 const noOneWaitingForCounseling = computed(() => {
  return testsWaitingForCounseling.value === null || testsWaitingForCounseling.value?.length === 0;
});

/**
 * Methods
 */
const startNewCounseling = async () => {
  await checkForTests();
  
  if (testsWaitingForCounseling.value !== null) {
    testsWaitingForCounseling.value.status = 'counseling';
    testsWaitingForCounseling.value.roomId = room.value;
    testsWaitingForCounseling.value.counselorId = user.id;

    await updateTest(testsWaitingForCounseling.value);
    currentTest.value = testsWaitingForCounseling.value;
  }
  store.commit('setEvent', selectedEvent.value);
  store.commit('setRoomId', room.value);
  store.commit('setTest', currentTest.value);

  event = selectedEvent.value;

  step.value = 1;
};

const endCounseling = async () => {
  currentTest.value.status = 'waitingForTest';
  await updateTest(currentTest.value);
  store.commit('clearTest');
  step.value = 0;
};
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

const checkForTests = async () => {
  testsWaitingForCounseling.value = await getNextTestToLine(selectedEvent.value, 'waitingForCounseling', 'asc');
};

/**
 * Lifecycle
 */
onMounted(async () => {
  if(event.length) {
    selectedEvent.value = event;
    await checkForTests();

    const test = store.getters.test;

    if(Object.keys(test).length > 0) {
      currentTest.value = test;
      step.value = 1;
    }
  }
  room.value = store.getters.roomId || '';
  await getEventsMethod();
});
</script>