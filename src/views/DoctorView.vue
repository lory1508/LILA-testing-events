<template>
  <div class="flex flex-col gap-8 justify-center items-center p-4">
    <n-h1>Dott. {{user.name}}</n-h1>

    <!-- Step common -->
    <div v-if="showStep('common')" class="flex flex-col gap-8 justify-center items-center p-4">
      <div v-show="!event.length">
        <span>Indica l'evento a cui stai partecipando</span>
        <n-select v-model:value="selectedEvent" :options="eventsOptions" class="w-96" @update:value="checkForTests" />
      </div>
      <div>
        <span>Indica la stanza nella quale stai ricevendo</span>
        <n-input v-model:value="room" placeholder="Inserisci il numero della stanza" class="w-96" />
      </div>

      <div class="flex flex-col gap-2">
        <n-button
          type="primary"
          class="py-8 shadow-md shadow-gray-400 w-96 h-24 justify-center items-center border-2 border-emerald-400
            hover:scale-105 hover:shadow-emerald-400 transition duration-200"
          @click="callForTest"
          :disabled="noOneWaitingForTest"
        >
          <span class="text-xl">Chiama per test</span>
        </n-button>
        <n-tag v-if="noOneWaitingForTest" type="success" class="justify-center text-center">Nessuno in attesa di test</n-tag>
      </div>


      <div class="flex flex-col gap-2">
        <n-button
          type="warning"
          class="py-8 shadow-md shadow-gray-400 w-96 h-24 justify-center items-center border-2 border-amber-400
            hover:scale-105 hover:shadow-amber-400 transition duration-1000"
          @click="callForResult"
          :disabled="noOneWaitingForResult"
        >
          <span class="text-xl">Chiama per comunicare un risultato</span>
        </n-button>
        <n-tag v-if="noOneWaitingForResult" type="warning" class="justify-center text-center">Nessuno in attesa di risultato</n-tag>
      </div>

      <n-divider />
      

      <n-data-table
        :columns="columns"
        :data="testsDoneByDoctor"
        :bordered="true"
      />
    </div>

    <!-- Step callForTest -->
    <div v-if="showStep('callForTest')">
      <CallingTest :test="currentTest" @endTest="goToStep('common')" />
    </div>

    <!-- Step callForResult -->
    <div v-if="showStep('callForResult')">
      <CallingTest :test="currentTest" @endTest="goToStep('common')" />
    </div>
  </div>
</template>

<script setup>
/**
 * imports
 */
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { getNextTestToLine, updateTest, getTestsByDoctorId } from '@/api/tests';
import { getEvents } from '@/api/events';
import CallingTest from '@/components/doctor/CallingTest.vue';

/**
 * Computed
 */
const noOneWaitingForTest = computed(() => {
  return testsWaitingToBeCalled.value === null || testsWaitingToBeCalled.value?.length === 0;
});
const noOneWaitingForResult = computed(() => {
  return testsWaitingForResult.value === null || testsWaitingForResult.value?.length === 0;
});

/**
 * Data
 */
const user = ref({});
const store = useStore();

let event = store.getters.event;
let roomSaved = store.getters.roomId;
const room = ref('');
const events = ref([]);
const eventsOptions = ref([]);
const selectedEvent = ref(null);
const currentTest = ref(null);

const testsWaitingToBeCalled = ref([]);
const testsWaitingForResult = ref([]);

const step = ref('common');
const testsDoneByDoctor = ref([]);
const columns = [
  {
    title: 'Numero utente',
    key: 'customerId',
  },
  {
    title: "Orario test",
    key: "formattedDate",
  },
  {
    title: "Timer",
    key: "timer",
  },
]

/**
 * Methods
 */
const goToStep = async (stepName) => {
  // TODO: aggiungere chiamata per i test ogni minuto
  await getTestByDoctorId();
  step.value = stepName;
};
const showStep = (stepName) => {
  return step.value === stepName;
};
const callForTest = async () => {
  testsWaitingToBeCalled.value = await getNextTestToLine(selectedEvent.value, 'waitingForTest', 'asc');
  if (testsWaitingToBeCalled.value !== null) {
    testsWaitingToBeCalled.value.status = 'testing';
    testsWaitingToBeCalled.value.roomId = room.value;
    testsWaitingToBeCalled.value.doctorId = user.value.id;
    await updateTest(testsWaitingToBeCalled.value);

    store.commit('setEvent', selectedEvent.value);
    store.commit('setRoomId', room.value);
    event = selectedEvent.value;

    currentTest.value = testsWaitingToBeCalled.value;
    step.value =  'callForTest';
  } else {
    // TODO: show alert if no test to line
  }
};

const callForResult = async () => {
  testsWaitingForResult.value = await getNextTestToLine(selectedEvent.value, 'waitingForResult', 'asc', user.value.id);
  if (testsWaitingForResult.value !== null) {
    testsWaitingForResult.value.status = 'gettingResult';
    testsWaitingForResult.value.roomId = room.value;
    await updateTest(testsWaitingForResult.value);

    store.commit('setEvent', selectedEvent.value);
    store.commit('setRoomId', room.value);
    event = selectedEvent.value;

    currentTest.value = testsWaitingForResult.value;
    step.value =  'callForResult';
  } else {
    console.log('no one waiting for result');
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
const getUser = () => {
  user.value = store.getters.user;
}

// TODO: timer shows 1 extra hour
const getTestByDoctorId = async () => {
  testsWaitingToBeCalled.value = await getNextTestToLine(selectedEvent.value, 'waitingForTest', 'asc');
  const tests = await getTestsByDoctorId(user.value.id, selectedEvent.value);
  testsWaitingForResult.value = tests.filter(t => t.status == 'waitingForResult');
  if(tests.length > 0) {
    testsDoneByDoctor.value = [];
    tests.forEach(test => {
      console.log(test);
      const updatedAtTime = test.updatedAt
      console.log(updatedAtTime.toDate());
      test.formattedDate = test.updatedAt.toDate().toLocaleDateString('it-IT', {
        hour: 'numeric',
        minute: 'numeric',
      });
      const nowTime = new Date();
      test.timer = new Date(nowTime - test.updatedAt.toDate()).toLocaleTimeString('it-IT', {
        hour: 'numeric',
        minute: 'numeric',
      });
      testsDoneByDoctor.value.push(test);
    });
  }
}

const checkForTests = async () => {
  testsWaitingToBeCalled.value = await getNextTestToLine(selectedEvent.value, 'waitingForTest', 'asc');
  testsWaitingForResult.value = await getNextTestToLine(selectedEvent.value, 'waitingForResult', 'asc', user.value.id);
}

/**
 * Lifecycle
 */
onMounted(async () => {
  getUser();
  if(event.length) {
    selectedEvent.value = event;
    testsWaitingToBeCalled.value = await getNextTestToLine(selectedEvent.value, 'waitingForTest', 'asc');
    testsWaitingForResult.value = await getNextTestToLine(selectedEvent.value, 'waitingForResult', 'asc', user.value.id);
  }
  if(roomSaved=='""') {
    roomSaved = '';
  } else {
    room.value = roomSaved.toString();
  }
  await getEventsMethod();
  await getTestByDoctorId();
});
</script>