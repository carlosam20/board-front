<script lang="ts">


</script>

<template>
  <fwb-navbar class="justify-center">
    <template #logo>
      <fwb-navbar-logo alt="Flowbite logo" image-url="/assets/logo.svg" link="#">
        BoardCollab
      </fwb-navbar-logo>
    </template>
    <template #default="{isShowMenu}">
      <fwb-navbar-collapse :is-show-menu="isShowMenu">
        <fwb-navbar-link is-active link="#">
          Home
        </fwb-navbar-link>
        <fwb-navbar-link link="#">
          Canvas
        </fwb-navbar-link>
      </fwb-navbar-collapse>
    </template>
    <template #right-side>
      <fwb-button>
        Sign in
      </fwb-button>
      <fwb-button>
        Sign up
      </fwb-button>
      <fwb-button @click="createRoom">
        Create Room
      </fwb-button>
    </template>
  </fwb-navbar>

  <div class="flex justify-end">
    <fwb-toast 
    v-if="showToast" 
    :type="toastType" ç
    closable @close="showToast = false" >
    <p class="text-white text-center">{{ toastMessage }}</p>
    </fwb-toast>
  </div>
</template>

<script setup lang="ts">
import {
  FwbButton,
  FwbNavbar,
  FwbNavbarCollapse,
  FwbNavbarLink,
  FwbNavbarLogo,
} from 'flowbite-vue'
import { useRoomNavigator } from '../services/roomNavigator';
import { ref } from 'vue';
import { FwbToast } from 'flowbite-vue'

const showToast = ref(false);
const toastType = ref('success'); // or 'danger', 'warning', etc.
const toastMessage = ref('');
const { createAndNavigateToRoom } = useRoomNavigator();

function createRoom() {
  try {
    createAndNavigateToRoom();
    toastMessage.value = "Room created";
    toastType.value = "success"; 
  } catch (error) {
    toastMessage.value = "Failed to create room:";
    toastType.value = "danger"; 
  }

  showToast.value = true;
}


</script>

<style lang="css">
.success{
  background-color: #5aa80b;
}

.error{
  background-color: #a80b0b;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

</style>