<template>
  <div class="p-4 flex flex-col gap-4">
    <div class="flex flex-row justify-between items-baseline">
      <n-h1>Utenti</n-h1>
      <n-button
        type="primary"
        size="large"
        @click="openCreateUser"
      > + Aggiungi utente</n-button>
    </div>
    
    <n-data-table
      striped
      :columns="columns"
      :data="users"
      :bordered="true"
    />
  </div>
  <n-drawer v-model:show="active" :width="502" placement="right">
    <n-drawer-content title="Crea un nuovo utente">
      <Manager @close="closeDrawer" />
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
/**
 * Imports
 */
import { ref, onMounted, h } from 'vue'
import { getUsers, deleteUser } from '@/api/users';
import { NButton, NTag, useNotification } from 'naive-ui';

import Manager from '@/components/users/Manager.vue';

/**
 * Data
 */
const user = ref(JSON.parse(localStorage.getItem('user')));
const active = ref(false);
const users = ref([]);
const columns = [
  {
    title: 'Nome',
    key: 'name',
    minWidth: 100,
  },
  {
    title: "Nome pubblico",
    key: "publicName",
    minWidth: 100,
  },
  {
    title: "Email",
    key: "email",
    minWidth: 100,
  },
  {
    title: "Ruolo",
    key: "role",
    render(row) {
      let typeTag = "success";
      switch (row.role) {
        case 'admin':
          typeTag = "success";
          break;
      
        case 'counselor':
          typeTag = "warning";
          break;
        
        case 'doctor': 
          typeTag = "error";
          break;

        case 'receptionist':
          typeTag = "info";
          break;

        default:
          break;
      }
      return h(
        NTag,
        {
          style: {
            marginRight: "6px",
            marginBottom: "6px"
          },
          type: typeTag,
          bordered: false
        },
        {
          default: () => {
            const roles = {
              admin: "Amministratore",
              counselor: "Counselor",
              doctor: "Medico",
              receptionist: "Accoglienza"
            }
            return roles[row.role]
          }
        }
      );
    }
  },
  {
    title: "Azioni",
    key: "actions",
    render(row) {
      return h(
        NButton,
        {
          type: "error",
          strong: true,
          size: "small",
          disabled: row.id == user.value.id,
          onClick: () => handleDeleteUser(row.id),
        },
        { default: () => "Cancella" }
      );
    }
  }
]
const notification = useNotification();

/**
 * Methods
 */
const openCreateUser = () => {
  active.value = true;
}

const fetchUsers = async () => {
  users.value = await getUsers();
}

const handleDeleteUser = async (id) => {
  await deleteUser(id);
  await fetchUsers();
  notification.success({
    title: "Utente cancellato",
    description: "L'utente è stato cancellato con successo",
    duration: 2000
  });
}

const closeDrawer = async () => {
  active.value = false;
  notification.success({
    title: "Utente creato",
    description: "L'utente è stato creato con successo",
    duration: 2000
  });
  await fetchUsers();
}

/**
 * Lifecycle
 */
onMounted(async () => {
  await fetchUsers();
})
</script>