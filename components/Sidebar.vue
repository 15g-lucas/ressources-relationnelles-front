<template>
  <nav class="fixed top-0 left-0 z-50 w-64 h-screen bg-white text-black flex flex-col p-4 space-y-4 border-r border-black">
    <NuxtLink
      to="/"
      :class="['sidebar-btn', route.path === '/' ? 'active' : '']"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2 inline" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
      Accueil
    </NuxtLink>
    <NuxtLink
      to="/profil"
      :class="['sidebar-btn', route.path === '/profil' ? 'active' : '']"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2 inline" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3.3 0-9.8 1.6-9.8 4.9v2.7h19.5v-2.7c0-3.3-6.5-4.9-9.7-4.9z"/>
      </svg>
      Profil
    </NuxtLink>
    <NuxtLink
      to="/ajouter"
      :class="['sidebar-btn', route.path === '/ajouter' ? 'active' : '']"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2 inline" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 13H13v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
      </svg>
      Ajouter
    </NuxtLink>
    <NuxtLink
      to="/parametres"
      :class="['sidebar-btn', route.path === '/parametres' ? 'active' : '']"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2 inline" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.14,12.94c0.04,-0.3 0.06,-0.61 0.06,-0.94s-0.02,-0.64 -0.06,-0.94l2.03,-1.58c0.18,-0.14 0.23,-0.4 0.12,-0.61l-1.92,-3.32c-0.11,-0.2 -0.36,-0.28 -0.57,-0.2l-2.39,0.96c-0.5,-0.38 -1.05,-0.7 -1.66,-0.94L14.96,2.5C14.94,2.22 14.7,2 14.42,2h-4.83c-0.28,0 -0.52,0.22 -0.54,0.5L8.61,5.37c-0.61,0.24 -1.17,0.56 -1.66,0.94l-2.39,-0.96c-0.22,-0.09 -0.46,0 -0.57,0.2l-1.92,3.32c-0.11,0.21 -0.06,0.47 0.12,0.61l2.03,1.58C4.88,11.36 4.86,11.68 4.86,12s0.02,0.64 0.06,0.94L2.89,14.52c-0.18,0.14 -0.23,0.4 -0.12,0.61l1.92,3.32c0.11,0.2 0.36,0.28 0.57,0.2l2.39,-0.96c0.5,0.38 1.05,0.7 1.66,0.94l0.44,2.87c0.02,0.28 0.26,0.5 0.54,0.5h4.83c0.28,0 0.52,-0.22 0.54,-0.5l0.44,-2.87c0.61,-0.24 1.17,-0.56 1.66,-0.94l2.39,0.96c0.22,0.09 0.46,0 0.57,-0.2l1.92,-3.32c0.11,-0.21 0.06,-0.47 -0.12,-0.61l-2.03,-1.58ZM12,15.5c-1.93,0 -3.5,-1.57 -3.5,-3.5s1.57,-3.5 3.5,-3.5 3.5,1.57 3.5,3.5 -1.57,3.5 -3.5,3.5Z"/>
      </svg>
      Paramètres
    </NuxtLink>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<style lang="postcss" scoped>
.sidebar-btn {
  @apply py-2 px-4 rounded hover:bg-gray-200 transition cursor-pointer;
  color: black;
  text-decoration: none;
}
.sidebar-btn.active {
  @apply bg-blue-600 text-white font-semibold;
}
</style>
