<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1 ml-64 min-h-screen p-4">
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