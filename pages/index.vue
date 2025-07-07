<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <h1 class="text-2xl font-bold text-gray-900">
            Ressources Relationnelles
          </h1>
          <div class="space-x-4">
            <NuxtLink
              to="/login"
              class="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Connexion
            </NuxtLink>
            <NuxtLink
              to="/register"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium"
            >
              S'inscrire
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center">
        <h2 class="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Bienvenue sur
          <span class="text-indigo-600">Ressources Relationnelles</span>
        </h2>
        
        <p class="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
          Découvrez notre plateforme de gestion des ressources relationnelles.
          Connectez-vous pour accéder à toutes les fonctionnalités.
        </p>

        <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/register"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
          >
            Créer un compte
          </NuxtLink>
          
          <NuxtLink
            to="/login"
            class="bg-white hover:bg-gray-50 text-indigo-600 border border-indigo-600 px-8 py-3 rounded-md text-lg font-medium transition-colors"
          >
            Se connecter
          </NuxtLink>
        </div>

        <!-- Section fonctionnalités -->
        <div class="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-1.5a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V6a2.25 2.25 0 00-2.25-2.25z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              Gestion des ressources
            </h3>
            <p class="text-gray-600">
              Organisez et gérez vos ressources de manière efficace
            </p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm">
            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              Collaboration
            </h3>
            <p class="text-gray-600">
              Travaillez en équipe sur vos projets
            </p>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm">
            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              Suivi et analyses
            </h3>
            <p class="text-gray-600">
              Analysez vos performances et suivez vos objectifs
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// Meta de la page
definePageMeta({
  title: 'Accueil - Ressources Relationnelles'
})

// SEO
useSeoMeta({
  title: 'Ressources Relationnelles - Accueil',
  description: 'Plateforme de gestion des ressources relationnelles'
})
</script>