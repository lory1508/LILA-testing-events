<template>
  <div class="p-4 flex flex-col gap-4">
    <div class="flex flex-row justify-between items-baseline">
      <n-h1>Eventi</n-h1>
      <n-button
        type="primary"
        size="large"
        @click="openCreateEvent"
      > + Aggiungi evento</n-button>
    </div>
    
    <!-- TODO: dare la possibilità di segnare da quale numero partire durante la creazione e modifica dell'evento -->
    <n-data-table
      striped
      :loading="loading"
      :columns="columns"
      :data="events"
      :bordered="true"
    />
  </div>
  <n-drawer v-model:show="active" :width="502" placement="right">
    <n-drawer-content title="Crea un nuovo evento">
      <Manager @close="closeDrawer" />
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
/**
 * Imports
 */
import { ref, onMounted, h } from 'vue'
import { getEvents, createEvent, deleteEvent } from '@/api/events';
import { getUsers } from '@/api/users';
import { NButton, NTag, useNotification } from 'naive-ui';

import Manager from '@/components/events/Manager.vue';

/**
 * Data
 */
const loading = ref(false);
const active = ref(false);
const events = ref([]);
const users = ref([]);
const columns = [
  {
    title: 'Luogo',
    key: 'location',
    minWidth: 100,
  },
  {
    title: "Data",
    key: "formattedDate",
    minWidth: 100,
  },
  {
    title: "Counselor",
    key: "counselors",
    render(row) {
      const counselors = row.counselors.map((con) => {
        return h(
          NTag,
          {
            style: {
              marginRight: "6px",
              marginBottom: "6px"
            },
            type: "warning",
            bordered: false
          },
          {
            default: () => con.name
          }
        );
      });
      return counselors;
    }
  },
  {
    title: "Medici",
    key: "doctors",
    render(row) {
      const doctors = row.doctors.map((doc) => {
        return h(
          NTag,
          {
            style: {
              marginRight: "6px",
              marginBottom: "6px"
            },
            type: "error",
            bordered: false
          },
          {
            default: () => doc.name
          }
        );
      });
      return doctors;
    }
  },
  {
    title: "Accoglienza",
    key: "receptionists",
    render(row) {
      const receptionists = row.receptionists.map((doc) => {
        return h(
          NTag,
          {
            style: {
              marginRight: "6px",
              marginBottom: "6px"
            },
            type: "info",
            bordered: false
          },
          {
            default: () => doc.name
          }
        );
      });
      return receptionists;
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
          onClick: () => handleDeleteEvent(row.id),
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
const closeDrawer = async () => {
  active.value = false;
  notification.success({
    title: "Evento creato",
    description: "L'evento è stato creato con successo",
    duration: 2000
  });
  await fetchEvents();
}

const openCreateEvent = () => {
  active.value = true;
}

const fetchEvents = async () => {
  try{
    loading.value = true;
    const es = await getEvents();
    events.value = es.map((e) => {
      console.log( typeof e.date );
      return {
        ...e,
        formattedDate: new Date(e.date).toLocaleDateString(
          "it-IT",
          {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric"
          }
        ),
        counselors: e.counselors.map((c) => {
          const counselor = users.value.find((u) => u.id === c);
          return {
            id: counselor.id,
            name: counselor.name
          }
        }),
        doctors: e.doctors.map((d) => {
          const doctor = users.value.find((u) => u.id === d);
          return {
            id: doctor.id,
            name: doctor.name
          }
        }),
        receptionists: e.receptionists.map((r) => {
          const receptionist = users.value.find((u) => u.id === r);
          return {
            id: receptionist.id,
            name: receptionist.name
          }
        })
      }
    });
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

const fetchUsers = async () => {
  users.value = await getUsers();
}

const handleDeleteEvent = async (id) => {
  await deleteEvent(id);
  await fetchEvents();
}

/**
 * Lifecycle
 */
onMounted(async () => {
  await fetchUsers();
  await fetchEvents();
})
</script>