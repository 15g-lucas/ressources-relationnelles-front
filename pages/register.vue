<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Créer votre compte
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Ou 
          <NuxtLink to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
            connectez-vous à votre compte existant
          </NuxtLink>
        </p>
      </div>

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
          <!-- Prénom -->
          <div>
            <label for="prenom" class="block text-sm font-medium text-gray-700">
              Prénom *
            </label>
            <input
              id="prenom"
              v-model="form.prenom"
              type="text"
              required
              class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Votre prénom"
            />
          </div>

          <!-- Nom -->
          <div>
            <label for="nom" class="block text-sm font-medium text-gray-700">
              Nom *
            </label>
            <input
              id="nom"
              v-model="form.nom"
              type="text"
              required
              class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Votre nom"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Adresse email *
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

          <!-- Téléphone -->
          <div>
            <label for="telephone" class="block text-sm font-medium text-gray-700">
              Téléphone
            </label>
            <input
              id="telephone"
              v-model="form.telephone"
              type="tel"
              class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="+33 6 12 34 56 78"
            />
          </div>

          <!-- Mot de passe -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Mot de passe *
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

          <!-- Confirmation mot de passe -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirmer le mot de passe *
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
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
            class="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {{ isLoading ? 'Création en cours...' : 'Créer mon compte' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
// Middleware pour les invités seulement
definePageMeta({
  middleware: 'guest'
})

const { register, isLoading } = useAuth()

// Formulaire
const form = reactive({
  prenom: '',
  nom: '',
  email: '',
  telephone: '',
  password: '',
  confirmPassword: ''
})

const errorMessage = ref('')
const successMessage = ref('')

// Fonction de soumission
const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  // Validation basique
  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Les mots de passe ne correspondent pas'
    return
  }
  
  if (form.password.length < 8) {
    errorMessage.value = 'Le mot de passe doit contenir au moins 8 caractères'
    return
  }
  
  // Appel à l'API
  const result = await register({
    prenom: form.prenom,
    nom: form.nom,
    email: form.email,
    telephone: form.telephone,
    password: form.password,
    confirmPassword: form.confirmPassword
  })
  
  if (result.success) {
    successMessage.value = result.message
    // Redirection vers le dashboard
    setTimeout(() => {
      navigateTo('/dashboard')
    }, 1000)
  } else {
    errorMessage.value = result.message
  }
}
</script>