<template>
    <div>
        <n-form
            ref="formRef"
            :label-width="80"
            :model="formValue"
            :rules="rules"
            size="medium"
        >
            <n-form-item first label="Location" prop="location" required="">
                <n-input v-model:value="formValue.location" />
            </n-form-item>
            <n-form-item first label="Data" prop="date" required="">
                <n-date-picker
                    v-model:formatted-value="formattedDate"
                    value-format="yyyy-MM-dd HH:mm"
                    type="datetime"
                    clearable
                />
            </n-form-item>
            <n-form-item label="Seleziona i counselor" prop="counselors" required="">
                <n-select 
                    multiple
                    filterable
                    v-model:value="formValue.counselors"
                    :options="counselorsOptions"
                    placeholder="Seleziona i counselor"
                />
            </n-form-item>
            <n-form-item label="Seleziona i medici" prop="doctors" required="">
                <n-select 
                    multiple
                    filterable
                    v-model:value="formValue.doctors"
                    :options="doctorsOptions"
                    placeholder="Seleziona i medici"
                />
            </n-form-item>
            <n-form-item label="Seleziona i volontari accoglienza" prop="receptionists" required="">
                <n-select 
                    multiple
                    filterable
                    v-model:value="formValue.receptionists"
                    :options="receptionistsOptions"
                    placeholder="Seleziona i volontari accoglienza"
                />
            </n-form-item>
            <n-button 
                type="primary"
                @click="submit"
            >
                Crea evento
            </n-button>
        </n-form>
    </div>
</template>

<script setup>
/**
 * Imports
 */
import { NFormItem } from 'naive-ui';
import { defineProps, ref, reactive, onMounted } from 'vue';
import { createEvent } from '@/api/events';
import { getUsers } from '@/api/users';

/**
 * Data
 */
const props = defineProps({
    events: {
        type: Array,
        required: false
    }
});
const emits = defineEmits(['close']);

const counselorsOptions = ref([]);
const doctorsOptions = ref([]);
const receptionistsOptions = ref([]);

const formattedDate = ref(null);
const formRef = ref(null);
const formValue = reactive({
    location: '',
    date: '',
    counselors: [],
    doctors: [],
    receptionists: []
});
const rules = {
    location: [
        { required: true, message: 'Inserisci il luogo', trigger: 'blur' },
        { min: 3, max: 100, message: 'Lunghezza minima 3 caratteri', trigger: 'blur' }
    ],
    date: [
        { required: true, message: 'Inserisci la data', trigger: 'blur' }
    ]
};

/**
 * Methods
 */
const submit = (e) => {
    e.preventDefault();
    formRef.value?.validate(async (errors) => {
        if(!errors) {
            const event = {
                location: formValue.location,
                date: formattedDate.value,
                counselors: formValue.counselors,
                doctors: formValue.doctors,
                receptionists: formValue.receptionists
            };
            await createEvent(event);
            emits('close')
        } else {
            console.log(errors);
        }
    });
};
const fetchUsers = async () => {
    const users = await getUsers();

    counselorsOptions.value = users
        .filter((user) => user.role === 'counselor')
        .map((user) => {
            return {
                label: `${user.name} | ${user.publicName}`,
                value: user.id
            };
        });

    doctorsOptions.value = users
        .filter((user) => user.role === 'doctor')
        .map((user) => {
            return {
                label: `${user.name} | ${user.publicName}`,
                value: user.id
            };
        });

    receptionistsOptions.value = users
        .filter((user) => user.role === 'receptionist')
        .map((user) => {
            return {
                label: `${user.name} | ${user.publicName}`,
                value: user.id
            };
        });
};

/**
 * Lifecycle
 */
onMounted( async () => {
    await fetchUsers(); 
});
</script>