<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4">
            <NuxtLink to="/resources" class="text-indigo-600 hover:text-indigo-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </NuxtLink>
            <h1 class="text-2xl font-bold text-gray-900">Soumettre une ressource</h1>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Messages d'état -->
      <div v-if="successMessage" class="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
        {{ successMessage }}
      </div>
      
      <div v-if="errorMessage" class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {{ errorMessage }}
      </div>

      <!-- Informations sur la modération -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-800">Modération requise</h3>
            <div class="mt-2 text-sm text-blue-700">
              <p>Votre ressource sera examinée par notre équipe de modération avant d'être publiée. Ce processus garantit la qualité et la pertinence des contenus partagés.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulaire -->
      <div class="bg-white shadow rounded-lg">
        <form @submit.prevent="handleSubmit" class="space-y-6 p-6">
          <!-- Titre -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">
              Titre de la ressource *
            </label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ex: Conférence sur le Leadership Digital"
            />
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="4"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Décrivez votre ressource en détail..."
            ></textarea>
          </div>

          <!-- Catégorie -->
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700">
              Catégorie *
            </label>
            <select
              id="category"
              v-model="form.category"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="formation">Formation</option>
              <option value="networking">Networking</option>
              <option value="emploi">Emploi</option>
              <option value="entrepreneuriat">Entrepreneuriat</option>
              <option value="finance">Finance</option>
              <option value="technologie">Technologie</option>
              <option value="sante">Santé</option>
              <option value="education">Éducation</option>
            </select>
          </div>

          <!-- Type de ressource -->
          <div>
            <label for="resourceType" class="block text-sm font-medium text-gray-700">
              Type de ressource *
            </label>
            <select
              id="resourceType"
              v-model="form.resourceType"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Sélectionner un type</option>
              <option value="article">Article</option>
              <option value="evenement">Événement</option>
              <option value="contact">Contact</option>
              <option value="formation">Formation</option>
              <option value="outil">Outil</option>
              <option value="video">Vidéo</option>
              <option value="livre">Livre</option>
              <option value="podcast">Podcast</option>
            </select>
          </div>

          <!-- URL de l'image (optionnel) -->
          <div>
            <label for="image" class="block text-sm font-medium text-gray-700">
              URL de l'image (optionnel)
            </label>
            <input
              id="image"
              v-model="form.image"
              type="url"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://exemple.com/image.jpg"
            />
            <p class="mt-1 text-sm text-gray-500">Si aucune image n'est fournie, une image par défaut sera utilisée.</p>
          </div>

          <!-- Tags -->
          <div>
            <label for="tags" class="block text-sm font-medium text-gray-700">
              Tags (optionnel)
            </label>
            <input
              id="tags"
              v-model="tagsInput"
              type="text"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="leadership, digital, management (séparés par des virgules)"
            />
            <p class="mt-1 text-sm text-gray-500">Ajoutez des mots-clés séparés par des virgules pour faciliter la recherche.</p>
          </div>

          <!-- Aperçu des tags -->
          <div v-if="form.tags.length > 0" class="flex flex-wrap gap-2">
            <span 
              v-for="tag in form.tags" 
              :key="tag"
              class="inline-flex px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <NuxtLink 
              to="/resources"
              class="bg-gray-300 text-gray-700 px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-400 transition-colors"
            >
              Annuler
            </NuxtLink>
            <button 
              type="submit"
              :disabled="isSubmitting || !isFormValid"
              class="bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSubmitting ? 'Soumission...' : 'Soumettre pour modération' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
// Middleware d'authentification
definePageMeta({
  middleware: 'auth'
})

const { user, submitResource } = useAuth()

// États réactifs
const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const tagsInput = ref('')

const form = ref({
  title: '',
  description: '',
  category: '',
  resourceType: '',
  image: '',
  tags: []
})

// Computed
const isFormValid = computed(() => {
  return form.value.title && 
         form.value.description && 
         form.value.category && 
         form.value.resourceType
})

// Watcher pour les tags
watch(tagsInput, (newValue) => {
  if (newValue) {
    form.value.tags = newValue
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
  } else {
    form.value.tags = []
  }
})

// Méthodes
const handleSubmit = async () => {
  if (!isFormValid.value) return

  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const resourceData = {
      ...form.value,
      // Générer une image par défaut si aucune n'est fournie
      image: form.value.image || `https://picsum.photos/400/200?random=${Date.now()}`
    }

    const result = await submitResource(resourceData)
    
    if (result.success) {
      successMessage.value = result.message
      
      // Reset le formulaire
      form.value = {
        title: '',
        description: '',
        category: '',
        resourceType: '',
        image: '',
        tags: []
      }
      tagsInput.value = ''
      
      // Rediriger vers les ressources après 3 secondes
      setTimeout(() => {
        navigateTo('/resources')
      }, 3000)
    } else {
      errorMessage.value = result.message
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors de la soumission de la ressource'
    console.error('Erreur soumission:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Redirection si pas connecté
if (process.client && !user.value) {
  await navigateTo('/login')
}

// SEO
useSeoMeta({
  title: 'Soumettre une ressource - Ressources Relationnelles',
  description: 'Proposez une nouvelle ressource à la communauté'
})
</script> 