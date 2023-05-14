<template>
  <div class="flex flex-col gap-4 justify-center items-center p-4">
    <n-card class="flex flex-col justify-center items-center gap-40">
      
      <div class="flex flex-row items-center justify-center gap-4">
        <n-spin size="medium" /> 
        <n-h2 v-if="type=='testing'">Test in corso... </n-h2>
        <n-h2 v-if="type=='gettingResult'">Comunicazione esito in corso... </n-h2>
      </div>

      <span v-if="type=='testing'">Stai effettuando il test al numero </span>
      <span v-if="type=='gettingResult'">Stai comunicando l'esito al numero </span>
      
      <n-tag size="large" type="success">
        <span class="text-2xl p-4">{{currentNumber}}</span>
      </n-tag>
    </n-card>

    <n-button
      :bordered="false"
      class="flex flex-col shadow-md shadow-gray-400 w-96 h-24 justify-center items-center border-2 border-amber-400
        hover:cursor-pointer hover:scale-105 hover:shadow-amber-400 transition duration-200"
      @click="endTest"
      size="large"
      type="warning"
    >
      <span class="text-xl">Test completato</span>
    </n-button>
  </div>
</template>

<script setup>
/**
 * imports
 */
import { ref, onMounted } from 'vue';
import { updateTest } from '@/api/tests';

/**
 * Props
 */
const props = defineProps({
  test: {
    type: Object,
    required: true,
  }
});

/**
 * Emits
 */
const emits = defineEmits(['endTest']);

/**
 * Data
 */
const currentNumber = ref(0);
const type = ref('');

/**
 * Methods
 */
const endTest = async () => {
  try{
    const tmp_test = props.test;
    if(tmp_test.status === 'testing'){
      tmp_test.status = 'waitingForResult';
      tmp_test.updatedAt = new Date();
    } else if(tmp_test.status === 'gettingResult')
      tmp_test.status = 'completed';
    await updateTest(tmp_test);
    emits('endTest');
  } catch (error) {
    console.error(error);
  }
};
const getCurrentNumber = () => {
  currentNumber.value = props.test.customerId;
};

/**
 * Lifecycle
 */
onMounted(() => {
  getCurrentNumber();
  type.value = props.test.status;
});
</script>