<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center space-x-3">
          <button 
            @click="goBack"
            class="back-button"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-lg font-semibold text-gray-900">Détails</h1>
        </div>
        <div class="flex items-center space-x-2">
          <button 
            @click="toggleFavorite"
            :class="[
              'p-2 rounded-md transition-colors',
              resource?.isFavorite ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-500 hover:text-yellow-500'
            ]"
          >
            <svg 
              :class="['w-5 h-5', resource?.isFavorite ? 'fill-current' : '']"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
          <button 
            @click="shareResource"
            class="p-2 rounded-md text-gray-500 hover:text-blue-500 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Contenu de la ressource -->
    <main v-if="resource" class="pb-20">
      <!-- Image principale -->
      <div v-if="resource.image" class="relative">
        <img 
          :src="resource.image" 
          :alt="resource.title"
          class="w-full h-48 object-cover"
        />
        <div class="absolute top-4 right-4">
          <span :class="[
            'px-3 py-1 rounded-full text-sm font-medium',
            getResourceTypeColor(resource.resourceType)
          ]">
            {{ getResourceTypeLabel(resource.resourceType) }}
          </span>
        </div>
      </div>

      <div class="p-4 space-y-6">
        <!-- Header de la ressource -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <span :class="[
              'px-3 py-1 rounded-full text-sm font-medium',
              getCategoryColor(resource.category)
            ]">
              {{ getCategoryLabel(resource.category) }}
            </span>
            <span class="text-sm text-gray-500">{{ formatDate(resource.date) }}</span>
          </div>
          
          <h1 class="text-xl font-bold text-gray-900 leading-tight mb-2">
            {{ resource.title }}
          </h1>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
              <span class="text-sm text-gray-600">{{ resource.author }}</span>
            </div>
            <span :class="[
              'px-2 py-1 rounded-full text-xs font-medium',
              getRelationTypeColor(resource.relationType)
            ]">
              {{ getRelationTypeLabel(resource.relationType) }}
            </span>
          </div>
        </div>

        <!-- Description complète -->
        <div>
          <h2 class="text-lg font-semibold text-gray-900 mb-3">Description</h2>
          <p class="text-gray-700 leading-relaxed">
            {{ resource.description }}
          </p>
          <!-- Description étendue (simulée) -->
          <p class="text-gray-700 leading-relaxed mt-4">
            Cette ressource fait partie d'une collection soigneusement sélectionnée pour vous aider dans votre développement professionnel et personnel. Elle a été validée par notre équipe d'experts et correspond aux besoins identifiés de notre communauté.
          </p>
        </div>

        <!-- Tags -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-2">Tags</h3>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="tag in resource.tags" 
              :key="tag"
              class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              #{{ tag }}
            </span>
          </div>
        </div>

        <!-- Statistiques -->
        <div class="grid grid-cols-3 gap-4 p-4 bg-gray-100 rounded-lg">
          <div class="text-center">
            <div class="text-lg font-semibold text-gray-900">{{ resource.likes }}</div>
            <div class="text-xs text-gray-500">J'aime</div>
          </div>
          <div class="text-center">
            <div class="text-lg font-semibold text-gray-900">{{ resource.views || 234 }}</div>
            <div class="text-xs text-gray-500">Vues</div>
          </div>
          <div class="text-center">
            <div class="text-lg font-semibold text-gray-900">{{ resource.shares || 12 }}</div>
            <div class="text-xs text-gray-500">Partages</div>
          </div>
        </div>

        <!-- Informations complémentaires -->
        <div class="space-y-4">
          <div v-if="resource.resourceType === 'evenement'">
            <h3 class="text-sm font-semibold text-gray-900 mb-2">Informations de l'événement</h3>
            <div class="bg-green-50 p-4 rounded-lg">
              <div class="flex items-center space-x-2 mb-2">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-sm font-medium text-green-900">Date : 15 février 2024, 14h00</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="text-sm text-green-700">Centre de Conférences, Paris</span>
              </div>
            </div>
          </div>

          <div v-if="resource.resourceType === 'contact'">
            <h3 class="text-sm font-semibold text-gray-900 mb-2">Informations de contact</h3>
            <div class="bg-purple-50 p-4 rounded-lg">
              <div class="flex items-center space-x-2 mb-2">
                <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span class="text-sm text-purple-700">{{ resource.author.toLowerCase().replace(' ', '.') }}@example.com</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
                </svg>
                <span class="text-sm text-purple-700">Spécialiste en {{ getCategoryLabel(resource.category) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions principales -->
        <div class="space-y-3">
          <button 
            v-if="resource.resourceType === 'evenement'"
            class="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            S'inscrire à l'événement
          </button>
          
          <button 
            v-else-if="resource.resourceType === 'formation'"
            class="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Commencer la formation
          </button>
          
          <button 
            v-else-if="resource.resourceType === 'contact'"
            class="w-full bg-purple-500 text-white py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors"
          >
            Contacter la personne
          </button>
          
          <button 
            v-else
            class="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Accéder à la ressource
          </button>
        </div>

        <!-- Ressources similaires -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Ressources similaires</h3>
          <div class="space-y-3">
            <div 
              v-for="similar in similarResources" 
              :key="similar.id"
              class="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200"
            >
              <img 
                :src="similar.image" 
                :alt="similar.title"
                class="w-12 h-12 rounded-lg object-cover"
              />
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-gray-900 text-sm truncate">{{ similar.title }}</h4>
                <p class="text-xs text-gray-500">{{ similar.author }}</p>
              </div>
              <button 
                @click="viewResource(similar.id)"
                class="text-blue-500 hover:text-blue-600 text-sm font-medium"
              >
                Voir
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- État de chargement -->
    <div v-else class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

// État
const resource = ref(null)
const similarResources = ref([])

// Données d'exemple (même structure que dans resources.vue)
const sampleResources = {
  1: {
    id: 1,
    title: "Conférence sur le Leadership Digital",
    description: "Une conférence exceptionnelle sur les nouvelles approches du leadership à l'ère numérique. Découvrez comment adapter votre style de management aux défis du monde moderne et développer les compétences nécessaires pour diriger efficacement dans un environnement digital.",
    category: 'formation',
    relationType: 'professionnel',
    resourceType: 'evenement',
    author: "Marie Dubois",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    likes: 45,
    views: 234,
    shares: 12,
    isFavorite: false,
    image: "https://images.unsplash.com/photo-1559523275-98fb3c56faf6?w=600&h=400&fit=crop",
    tags: ['leadership', 'digital', 'management', 'innovation', 'transformation']
  },
  2: {
    id: 2,
    title: "Guide complet du Networking efficace",
    description: "Apprenez les meilleures techniques pour développer votre réseau professionnel de manière authentique et durable. Ce guide pratique vous donnera tous les outils nécessaires pour créer des relations professionnelles solides.",
    category: 'networking',
    relationType: 'professionnel',
    resourceType: 'article',
    author: "Pierre Martin",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    likes: 32,
    views: 189,
    shares: 8,
    isFavorite: true,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
    tags: ['networking', 'relations', 'professionnel', 'business']
  }
}

// Labels et couleurs (même logique que ResourceCard)
const categoryLabels = {
  formation: 'Formation',
  networking: 'Networking',
  emploi: 'Emploi',
  entrepreneuriat: 'Entrepreneuriat',
  finance: 'Finance',
  technologie: 'Technologie',
  sante: 'Santé',
  education: 'Éducation'
}

const relationTypeLabels = {
  professionnel: 'Professionnel',
  personnel: 'Personnel',
  familial: 'Familial',
  amical: 'Amical',
  mentor: 'Mentorat',
  commercial: 'Commercial'
}

const resourceTypeLabels = {
  article: 'Article',
  evenement: 'Événement',
  contact: 'Contact',
  formation: 'Formation',
  outil: 'Outil',
  video: 'Vidéo',
  livre: 'Livre',
  podcast: 'Podcast'
}

// Méthodes
const goBack = () => {
  router.back()
}

const toggleFavorite = () => {
  if (resource.value) {
    resource.value.isFavorite = !resource.value.isFavorite
    console.log('Toggled favorite:', resource.value.id, resource.value.isFavorite)
  }
}

const shareResource = () => {
  if (navigator.share && resource.value) {
    navigator.share({
      title: resource.value.title,
      text: resource.value.description,
      url: window.location.href
    })
  } else {
    // Fallback
    navigator.clipboard.writeText(window.location.href)
    alert('Lien copié dans le presse-papier')
  }
}

const viewResource = (resourceId) => {
  navigateTo(`/resource/${resourceId}`)
}

const getCategoryColor = (category) => {
  const colors = {
    formation: 'bg-blue-100 text-blue-800',
    networking: 'bg-green-100 text-green-800',
    emploi: 'bg-purple-100 text-purple-800',
    entrepreneuriat: 'bg-orange-100 text-orange-800',
    finance: 'bg-yellow-100 text-yellow-800',
    technologie: 'bg-indigo-100 text-indigo-800',
    sante: 'bg-pink-100 text-pink-800',
    education: 'bg-teal-100 text-teal-800'
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
}

const getRelationTypeColor = (relationType) => {
  const colors = {
    professionnel: 'bg-blue-100 text-blue-800',
    personnel: 'bg-green-100 text-green-800',
    familial: 'bg-red-100 text-red-800',
    amical: 'bg-yellow-100 text-yellow-800',
    mentor: 'bg-purple-100 text-purple-800',
    commercial: 'bg-gray-100 text-gray-800'
  }
  return colors[relationType] || 'bg-gray-100 text-gray-800'
}

const getResourceTypeColor = (resourceType) => {
  const colors = {
    article: 'bg-blue-100 text-blue-800',
    evenement: 'bg-green-100 text-green-800',
    contact: 'bg-purple-100 text-purple-800',
    formation: 'bg-orange-100 text-orange-800',
    outil: 'bg-yellow-100 text-yellow-800',
    video: 'bg-red-100 text-red-800',
    livre: 'bg-indigo-100 text-indigo-800',
    podcast: 'bg-pink-100 text-pink-800'
  }
  return colors[resourceType] || 'bg-gray-100 text-gray-800'
}

const getCategoryLabel = (category) => categoryLabels[category] || category
const getRelationTypeLabel = (relationType) => relationTypeLabels[relationType] || relationType
const getResourceTypeLabel = (resourceType) => resourceTypeLabels[resourceType] || resourceType

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Initialisation
onMounted(() => {
  const resourceId = parseInt(route.params.id)
  resource.value = sampleResources[resourceId] || null
  
  // Simuler des ressources similaires
  similarResources.value = [
    {
      id: 3,
      title: "Les clés du leadership moderne",
      author: "Sophie Leroy",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
    },
    {
      id: 4,
      title: "Management d'équipe à distance",
      author: "Thomas Rousseau",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
    }
  ]
  
  if (!resource.value) {
    router.push('/resources')
  }
})

// SEO
useSeoMeta({
  title: computed(() => resource.value?.title || 'Ressource'),
  description: computed(() => resource.value?.description || 'Détails de la ressource')
})
</script> 