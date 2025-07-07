<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<script setup>
// Redirection automatique si on est sur la page racine
const route = useRoute()

onMounted(() => {
  if (route.path === '/') {
    // Rediriger vers login par défaut
    navigateTo('/login')
  }
})
</script>