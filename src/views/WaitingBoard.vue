<template>
    <div class="bg-zinc-200 h-screen">
        <div v-if="!loading" class="flex flex-col gap-4 p-4">
            <div class="flex flex-col gap-4 border-2 border-zinc-200 bg-white shadow-lg rounded-lg p-4">
                <n-gradient-text :size="32" type="success">Counseling</n-gradient-text>
                <div class="flex flex-wrap gap-4">
                    <div 
                        v-for="(waitingToBeCalled, index) in waitingForCounseling" 
                        :key="waitingToBeCalled.id"
                        class="flex justify-between items-center"    
                    >
                        <div 
                            class="flex flex-col py-6 px-12 bg-white rounded-lg shadow-lg w-fit text-2xl justify-center gap-4"
                            :class="{
                                'border-2 border-green-400 bg-green-200': index === 0,
                            }"
                        >
                            <div class="flex flex-col items-center">
                                <div>Numero</div> 
                                <div class="border border-green-400 bg-green-200 text-green-600 rounded-lg px-6 py-2 font-semibold">
                                    {{ waitingToBeCalled.customerId }}
                                </div>
                            </div>
                            <div class="flex flex-col items-center">
                                <div>Stanza</div>
                                <div class="border border-blue-400 bg-blue-200 text-blue-600 rounded-lg px-6 py-2 font-semibold">
                                    {{ waitingToBeCalled.roomId }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-row w-full gap-4">
                <div class="flex gap-4 w-full">
                    <div class="flex flex-col gap-4 border-2 border-zinc-200 bg-white shadow-lg rounded-lg p-4 w-1/2">
                        <n-gradient-text :size="32" type="danger">Chiamati per test</n-gradient-text>
                        <div class="flex flex-wrap gap-4">
                            <div 
                                v-for="(testToBeCalled, index) in waitingForTest" 
                                :key="testToBeCalled.id"
                                class="flex justify-between items-center"    
                            >
                                <div 
                                    class="flex flex-col py-6 px-12 bg-white rounded-lg shadow-lg w-fit text-2xl justify-center gap-4"
                                    :class="{
                                        'border-2 border-red-400 bg-red-200': index === 0,
                                    }"
                                >
                                    <div class="flex flex-col items-center">
                                        <div>Numero</div> 
                                        <div class="border border-green-400 bg-green-200 text-green-600 rounded-lg px-6 py-2 font-semibold">
                                            {{ testToBeCalled.customerId }}
                                        </div>
                                    </div>
                                    <div class="flex flex-col items-center">
                                        <div>Stanza</div>
                                        <div class="border border-blue-400 bg-blue-200 text-blue-600 rounded-lg px-6 py-2 font-semibold">
                                            {{ testToBeCalled.roomId }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col gap-4 border-2 border-zinc-200 bg-white shadow-lg rounded-lg p-4 w-1/2">
                        <n-gradient-text :size="32" type="info">Test</n-gradient-text>
                        <div class="flex flex-wrap gap-4">
                            <div 
                                v-for="(resultToBeCalled, index) in waitingForResult" 
                                :key="resultToBeCalled.id"
                                class="flex justify-between items-center"    
                            >
                                <div 
                                    class="flex flex-col py-6 px-12 bg-white rounded-lg shadow-lg w-fit text-2xl justify-center gap-4"
                                    :class="{
                                        'border-2 border-blue-400 bg-blue-200': index === 0,
                                    }"
                                >
                                    <div class="flex flex-col items-center">
                                        <div>Numero</div> 
                                        <div class="border border-green-400 bg-green-200 text-green-600 rounded-lg px-6 py-2 font-semibold">
                                            {{ resultToBeCalled.customerId }}
                                        </div>
                                    </div>
                                    <div class="flex flex-col items-center">
                                        <div>Stanza</div>
                                        <div class="border border-blue-400 bg-blue-200 text-blue-600 rounded-lg px-6 py-2 font-semibold">
                                            {{ resultToBeCalled.roomId }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <n-collapse class="p-4">
                <n-collapse-item title="Seleziona un evento da visualizzare">
                    <n-select v-model:value="selectedEvent" :options="eventsOptions" @update:value="loadTests" class="w-96" />
                </n-collapse-item>
            </n-collapse>
        </div>
        <div v-else>
            <n-spin size="large" /> Loading...
        </div>
    </div>
</template>

<script setup>
/**
 * Imports
 */
import { ref, onMounted } from 'vue';
import { getEvents } from '@/api/events';
import { getSortedTests } from '@/api/tests';

/**
 * Data
 */
const loading = ref(false);

const waitingForCounseling = ref([]);
const waitingForTest = ref([]);
const waitingForResult = ref([]);

const events = ref([]);
const eventsOptions = ref([]);
const selectedEvent = ref(null);

const columns = [
  {
    title: 'Numero',
    key: 'customerId',
  },
  {
    title: 'Stanza',
    key: 'roomId',
  },
  {
    title: 'Status',
    key: 'status',
  }
]

/**
 * Methods
 */
const loadTests = async () => {
    try{
        loading.value = true;

        const tests = await getSortedTests(selectedEvent.value);
        console.log(tests);

        waitingForCounseling.value = tests.filter(test => test.status === 'counseling');
        waitingForTest.value = tests.filter(test => test.status === 'testing');
        waitingForResult.value = tests.filter(test => test.status === 'gettingResult');

        waitingForCounseling.value = waitingForCounseling.value.slice(0, 10)

        setInterval(loadTests, 60000)
    } catch (error) {
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

/**
 * Lifecycle
 */
onMounted(async () => {
  await getEventsMethod();
});
</script>