<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Connexion
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Ou 
          <NuxtLink to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">
            créez votre compte
          </NuxtLink>
        </p>
      </div>

      <!-- Identifiants de test -->
      

      <!-- Formulaire -->
      <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
        <!-- Messages d'erreur/succès -->
        <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {{ errorMessage }}
        </div>
        
        <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          {{ successMessage }}
        </div>

        <div class="space-y-4">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Adresse email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="votre@email.com"
            />
          </div>

          <!-- Mot de passe -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>
        </div>

        <!-- Bouton de soumission -->
        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Connexion en cours...' : 'Se connecter' }}
          </button>
        </div>
      </form>

      <!-- Info simulation -->
      
    </div>
  </div>
</template>

<script setup>
// Middleware pour les invités seulement
definePageMeta({
  middleware: 'guest'
})

const { login, isLoading } = useAuth()

// Formulaire
const form = reactive({
  email: '',
  password: ''
})

const errorMessage = ref('')
const successMessage = ref('')

// Fonction pour remplir automatiquement les identifiants
const fillCredentials = (type) => {
  if (type === 'user') {
    form.email = 'user@exemple.com'
    form.password = 'password123'
  } else if (type === 'admin') {
    form.email = 'admin@exemple.com'
    form.password = 'admin123'
  } else if (type === 'marie') {
    form.email = 'marie.dubois@exemple.com'
    form.password = 'marie123'
  }
}

// Fonction de soumission
const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  // Appel à l'API simulée
  const result = await login({
    email: form.email,
    password: form.password
  })
  
  if (result.success) {
    successMessage.value = result.message
    // Redirection conditionnelle selon le rôle
    setTimeout(() => {
      // Si l'utilisateur est admin, aller vers la page admin
      if (result.data?.user?.role === 'admin') {
        navigateTo('/admin')
      } else {
        // Sinon, aller vers le dashboard
        navigateTo('/dashboard')
      }
    }, 1000)
  } else {
    errorMessage.value = result.message
  }
}
</script>
