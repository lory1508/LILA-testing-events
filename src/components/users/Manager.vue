<template>
  <div>
    <n-form
      ref="formRef"
      :label-width="80"
      :model="formValue"
      :rules="rules"
      size="medium"
    >
      <n-form-item first label="Nome" prop="name" required>
        <n-input v-model:value="formValue.name" />
      </n-form-item>
      <n-form-item
        first
        label="Email"
        prop="email"
        required
        :validation-status="validEmail"
        :feedback="invalidEmail"
      >
        <n-input v-model:value="formValue.email" />
      </n-form-item>
      <n-form-item first label="Ruolo" prop="role" required>
        <n-select v-model:value="formValue.role" :options="roles" clearable filterable>
        </n-select>
      </n-form-item>
      <n-form-item
        first
        label="Password"
        prop="password"
        required
        :validation-status="validPassword"
        :feedback="invalidPassword"
      >
        <n-input
          type="password"
          show-password-on="click"
          v-model:value="formValue.password"
          @keydown.enter="submit"
        />
      </n-form-item>
      <n-button type="primary" @click="submit" :disabled="disableSave"> Crea utente </n-button>
    </n-form>
  </div>
</template>

<script setup>
/**
 * Imports
 */
import { NFormItem } from "naive-ui";
import { defineProps, ref, reactive, computed } from "vue";
import { createUser } from "@/api/users";
import Md5 from "md5";

/**
 * Emits
 */
const emits = defineEmits(["close"]);

/**
 * Data
 */
const props = defineProps({
  users: {
    type: Array,
    required: false,
  },
});

const roles = [
  {
    label: "Accoglienza",
    value: "receptionist",
  },
  {
    label: "Admin",
    value: "admin",
  },
  {
    label: "Counselor",
    value: "counselor",
  },
  {
    label: "Medico",
    value: "doctor",
  },
];

const formRef = ref(null);
const formValue = reactive({
  name: "",
  email: "",
  role: "",
  password: "",
});
const rules = {
  name: [
    { required: true, message: "Inserisci il nome", trigger: "blur" },
    { min: 3, max: 100, message: "Lunghezza minima 3 caratteri", trigger: "blur" },
  ],
  email: [
    { required: true, message: "Inserisci l'email", trigger: "blur" },
    { type: "email", message: "Inserisci un'email valida", trigger: "blur" },
  ],
  role: [
    { required: true, message: "Inserisci il ruolo", trigger: "blur" },
    { min: 3, max: 100, message: "Lunghezza minima 3 caratteri", trigger: "blur" },
  ],
};

/**
 * Computed
 */
const disableSave = computed(() => {
  return !formValue.name || !formValue.email || !formValue.role || !formValue.password;
});
const validPassword = computed(() => {
  if (formValue.password.length < 8) {
    return "error";
  } else {
    return "success";
  }
});
const invalidPassword = computed(() => {
  if (formValue.password.length < 8) {
    return "La password deve essere lunga almeno 8 caratteri";
  } else {
    return "";
  }
});

const validEmail = computed(() => {
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValue.email)) {
    return "success";
  } else {
    return "error";
  }
});
const invalidEmail = computed(() => {
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValue.email)) {
    return "";
  } else {
    return "Inserisci un'email valida";
  }
});

/**
 * Methods
 */
const submit = (e) => {
  e.preventDefault();
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const newUser = {
        name: formValue.name,
        email: formValue.email,
        role: formValue.role,
        password: Md5(formValue.password),
      };
      await createUser(newUser);
      emits("close");
    } else {
      console.log(errors);
    }
  });
};

/**
 * Lifecycle
 */
// onMounted(() => {
//     console.log(props.events);
//     console.log(props.users);
// });
</script>
