<template>
  <div class="flex">
    <Sidebar />
    <!-- Desktop: margin left for sidebar, Mobile: margin bottom for tab bar -->
    <div class="flex-1 md:ml-64 ml-0 min-h-screen p-4 pb-20 md:pb-4">
      <MetaManager :meta="metaData" />
      <div class="content">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '~/components/Sidebar.vue';
</script>