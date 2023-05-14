<template>
  <div class="flex flex-col gap-4 justify-center items-center p-4 mx-auto w-fit">
    <n-h1>{{ user.publicName }}</n-h1>
    <div v-if="!loading && event.length">
      Al momento l'ultimo numero in coda è il numero:
      <n-tag size="large" type="success">
        <span class="text-2xl p-4"> {{currentNumber}} </span>
      </n-tag>
    </div>
    <n-select 
      v-show="!event.length" 
      v-model:value="selectedEvent" 
      :options="eventsOptions" 
      class="w-96" 
      @update:value="setCurrentNumber" 
    />

    <n-collapse>
      <n-collapse-item title="Modifica la numerazione" class="w-96">
        <span>Quale vuoi che sia il prossimo numero per questo evento?</span>
        <n-input-number 
          v-model:value="currentNumber" 
          class="w-96" 
          :disabled="!selectedEvent" 
        />
      </n-collapse-item>
    </n-collapse>

    <n-alert v-if="!selectedEvent" title="Evento non selezionato" type="warning" class="w-96">
      Ricordati di selezionare un evento
    </n-alert>
    <n-button
      class="flex flex-col shadow-md shadow-gray-400 w-96 h-24 justify-center items-center border-2 border-emerald-400
        hover:scale-105 hover:shadow-emerald-400 transition duration-200"
      @click="assignNumber"
      :disabled="!selectedEvent"
    >
      <span class="text-xl">Assegna numero</span>
    </n-button>
  </div>
</template>

<script setup>
/***
 * Imports
 */
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { createTest, getLatestTest } from '@/api/tests';
import { getEvents } from '@/api/events';
import { findLast } from 'lodash';

/**
 * Computed
 */
const numberNotAssigned = computed(() => {
  return selectedEvent.value && currentNumber.value == 0;
});

/**
 * Data
 */
const store = useStore();

const user = store.getters.user;
let event = store.getters.event;

const events = ref([]);
const eventsOptions = ref([]);
const selectedEvent = ref(null);
const currentNumber = ref(null);
const loading = ref(false);

/**
 * Methods
 */
const setCurrentNumber = async () => {
  loading.value = true;
  store.commit('setEvent', selectedEvent.value);
  event = selectedEvent.value;
  await getCurrentNumber();
};

const assignNumber = async () => {
  try{
    loading.value = true;
    await getCurrentNumber();
    currentNumber.value++;
    const test = {
      status: "waitingForCounseling",
      eventId: selectedEvent.value,
      createdAt: new Date(),
      customerId: currentNumber.value,
    };
    await createTest(test);

    store.commit('setEvent', selectedEvent.value);
    event = selectedEvent.value;
    await getCurrentNumber();
  } catch(error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
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

const getCurrentNumber = async () => {
  const resLatest = await getLatestTest(null, selectedEvent.value);
  
  if(resLatest != null)
    currentNumber.value = resLatest.customerId;
  else
    currentNumber.value = 0;

  loading.value = false;
};

/**
 * Lifecycle
 */
onMounted(async () => {
  if(event.length) {
    selectedEvent.value = event;
    await getCurrentNumber();
  }
  await getEventsMethod();
});
</script>