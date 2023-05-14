<template>
  <div v-if="store.getters.isUserLogged">
    <div 
      class="flex-row p-4 w-full border-b-2 border-b-zinc-200 items-center hidden md:flex justify-between"
    >
      <div class="flex flex-row">
        <n-image
          width="120"
          src="../../LILA_Cagliari.png"
          preview-disabled
        />
        <div v-if="store.getters.isUserAdmin">
          <n-menu 
            v-model:value="activeKey" 
            mode="horizontal" 
            :options="menuOptions"
          />
        </div>
      </div>
      <n-button :render-icon="renderIcon(LogoutIcon)" strong type="error" @click="logout">Logout</n-button>
    </div>
    <div class="flex md:hidden p-4">
      <n-button v-if="!store.getters.isUserAdmin" :render-icon="renderIcon(LogoutIcon)" strong type="error" @click="logout">Logout</n-button>
      <div v-else>
        <n-button :render-icon="renderIcon(MenuIcon)" circle size="large" strong type="success" @click="activate" />
        <n-drawer v-model:show="active" width="75%" height="100%" :placement="placement">
          <n-drawer-content>
            <div class="flex flex-col justify-between h-full"> 
              <n-button-group vertical size="large">
                <n-button :type="activePage('Dashboard')" :render-icon="renderIcon(HomeIcon)" @click="goToPage('Dashboard')">
                  Dashboard
                </n-button>
                <n-button :type="activePage('Events')" :render-icon="renderIcon(CalendarIcon)" @click="goToPage('Events')">
                  Eventi
                </n-button>
                <n-button :type="activePage('Users')" :render-icon="renderIcon(PeopleIcon)" @click="goToPage('Users')">
                  Volontari
                </n-button>
              </n-button-group>
              <n-button :render-icon="renderIcon(LogoutIcon)" strong type="error" @click="logout">
                Logout
              </n-button>
            </div>
          </n-drawer-content>
        </n-drawer>
      </div>
    </div>
  </div>
</template>

<script setup>
/***
 * imports
 */
import { ref, h } from 'vue';
import { useStore } from 'vuex';
import { useRouter, RouterLink } from 'vue-router';
import { NIcon } from "naive-ui";
import {
  HomeOutline as HomeIcon,
  LogOutOutline as LogoutIcon,
  CalendarNumberOutline as CalendarIcon,
  PeopleOutline as PeopleIcon,
  Menu as MenuIcon,
} from "@vicons/ionicons5";

const renderIcon = (icon) => {
  return () => h(NIcon, null, { default: () => h(icon) });
}

/***
 * Data
 */
const store = useStore();
const router = useRouter();
const activeKey = ref('dashboard');
const menuOptions = [
  {
    label: () => h(
      RouterLink,
      {
        to: {name: "Dashboard"}
      },
      { default: () => "Dashboard" }
    ),
    key: "dashboard",
    icon: renderIcon(HomeIcon)
  },
  {
    label: () => h(
      RouterLink,
      {
        to: {name: "Events"}
      },
      { default: () => "Eventi" }
    ),
    key: "events",
    icon: renderIcon(CalendarIcon)
  },
  {
    label: () => h(
      RouterLink,
      {
        to: {name: "Users"}
      },
      { default: () => "Volontari" }
    ),
    key: "users",
    icon: renderIcon(PeopleIcon)
  },
  // {
  //   label: () => h(
  //     RouterLink,
  //     {
  //       to: {name: "Medici"}
  //     },
  //     { default: () => "Medici" }
  //   ),
  //   key: "medici",
  //   icon: renderIcon(WorkIcon)
  // }
];
const active = ref(false);
const placement = ref("left");

/**
 * Methods
 */
const logout = () => {
  store.commit('clearUser');
  store.commit('clearEvent');
  router.push('/login');
};
const activate = (place) => {
  active.value = true;
  placement.value = place;
};
const goToPage = (page) => {
  active.value = false;
  router.push({name: page});
};
const activePage = (page) => {
  return router.currentRoute.value.name === page ? 'primary' : 'default';
};
</script>