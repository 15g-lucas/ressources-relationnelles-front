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
          <h1 class="text-lg font-semibold text-gray-900">Ressources</h1>
        </div>
        <div class="flex items-center space-x-2">
          <NuxtLink 
            v-if="user"
            to="/submit-resource"
            class="bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Soumettre
          </NuxtLink>
          <button 
            @click="showFilters = !showFilters"
            class="p-2 rounded-md hover:bg-gray-100"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
          </button>
          <span class="text-sm text-gray-500">{{ filteredResources.length }} résultat{{ filteredResources.length > 1 ? 's' : '' }}</span>
        </div>
      </div>
      
      <!-- Barre de recherche -->
      <div class="px-4 pb-3">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher des ressources..."
            class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>
    </header>

    <!-- Filtres (collapsible) -->
    <div v-if="showFilters" class="bg-white border-b border-gray-200 p-4">
      <div class="space-y-4">
        <!-- Tri -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Trier par</label>
          <select 
            v-model="sortBy"
            class="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="date_desc">Plus récent</option>
            <option value="date_asc">Plus ancien</option>
            <option value="title_asc">Titre A-Z</option>
            <option value="title_desc">Titre Z-A</option>
            <option value="popularity">Popularité</option>
          </select>
        </div>

        <!-- Catégories -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="category in categories"
              :key="category.value"
              @click="toggleFilter('category', category.value)"
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                activeFilters.category.includes(category.value)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ category.label }}
            </button>
          </div>
        </div>

        <!-- Types de relation -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Type de relation</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="relationType in relationTypes"
              :key="relationType.value"
              @click="toggleFilter('relationType', relationType.value)"
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                activeFilters.relationType.includes(relationType.value)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ relationType.label }}
            </button>
          </div>
        </div>

        <!-- Types de ressource -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Type de ressource</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="resourceType in resourceTypes"
              :key="resourceType.value"
              @click="toggleFilter('resourceType', resourceType.value)"
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                activeFilters.resourceType.includes(resourceType.value)
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ resourceType.label }}
            </button>
          </div>
        </div>

        <!-- Bouton reset -->
        <div class="flex justify-between items-center pt-2 border-t border-gray-200">
          <button 
            @click="resetFilters"
            class="text-sm text-gray-500 hover:text-gray-700"
          >
            Réinitialiser
          </button>
          <button 
            @click="showFilters = false"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600"
          >
            Appliquer ({{ filteredResources.length }})
          </button>
        </div>
      </div>
    </div>

    <!-- Filtres actifs (chips) -->
    <div v-if="hasActiveFilters" class="bg-white border-b border-gray-200 px-4 py-2">
      <div class="flex flex-wrap gap-2">
        <div
          v-for="filter in activeFilterChips"
          :key="filter.key"
          class="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
        >
          <span>{{ filter.label }}</span>
          <button 
            @click="removeFilter(filter.type, filter.value)"
            class="ml-1 hover:text-blue-600"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Liste des ressources -->
    <main class="p-4 pb-20">
      <!-- Chargement -->
      <div v-if="isLoading" class="text-center py-12">
        <svg class="animate-spin mx-auto h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-500 mt-2">Chargement des ressources...</p>
      </div>

      <!-- Liste des ressources -->
      <div v-else class="space-y-4">
        <ResourceCard
          v-for="resource in paginatedResources"
          :key="resource.id"
          :resource="resource"
          @view="viewResource"
          @favorite="toggleFavorite"
          @share="shareResource"
        />
      </div>

      <!-- Pas de résultats -->
      <div v-if="!isLoading && filteredResources.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.137 0-4.146-.832-5.636-2.364M6 20.14C3.26 18.668 1.5 15.98 1.5 13 1.5 7.477 5.977 3 11.5 3s10 4.477 10 10c0 2.98-1.26 5.668-3.5 7.14" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune ressource trouvée</h3>
        <p class="mt-1 text-sm text-gray-500">Essayez d'ajuster vos filtres ou votre recherche.</p>
        <button 
          @click="resetFilters"
          class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600"
        >
          Voir toutes les ressources
        </button>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center mt-8">
        <div class="flex space-x-2">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              currentPage === page
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            ]"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
const router = useRouter()
const { user, getAllResources } = useAuth()

// États
const showFilters = ref(false)
const searchQuery = ref('')
const sortBy = ref('date_desc')
const currentPage = ref(1)
const itemsPerPage = 10
const isLoading = ref(false)

const activeFilters = ref({
  category: [],
  relationType: [],
  resourceType: []
})

// Options de filtres
const categories = [
  { value: 'formation', label: 'Formation' },
  { value: 'networking', label: 'Networking' },
  { value: 'emploi', label: 'Emploi' },
  { value: 'entrepreneuriat', label: 'Entrepreneuriat' },
  { value: 'finance', label: 'Finance' },
  { value: 'technologie', label: 'Technologie' },
  { value: 'sante', label: 'Santé' },
  { value: 'education', label: 'Éducation' }
]

const relationTypes = [
  { value: 'professionnel', label: 'Professionnel' },
  { value: 'personnel', label: 'Personnel' },
  { value: 'familial', label: 'Familial' },
  { value: 'amical', label: 'Amical' },
  { value: 'mentor', label: 'Mentorat' },
  { value: 'commercial', label: 'Commercial' }
]

const resourceTypes = [
  { value: 'article', label: 'Article' },
  { value: 'evenement', label: 'Événement' },
  { value: 'contact', label: 'Contact' },
  { value: 'formation', label: 'Formation' },
  { value: 'outil', label: 'Outil' },
  { value: 'video', label: 'Vidéo' },
  { value: 'livre', label: 'Livre' },
  { value: 'podcast', label: 'Podcast' }
]

// Données des ressources
const resources = ref([])

// Computed
const filteredResources = computed(() => {
  let filtered = [...resources.value]

  // Recherche textuelle
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(resource => 
      resource.title.toLowerCase().includes(query) ||
      resource.description.toLowerCase().includes(query) ||
      resource.author.toLowerCase().includes(query) ||
      resource.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // Filtres par catégorie
  if (activeFilters.value.category.length > 0) {
    filtered = filtered.filter(resource => 
      activeFilters.value.category.includes(resource.category)
    )
  }

  // Filtres par type de relation
  if (activeFilters.value.relationType.length > 0) {
    filtered = filtered.filter(resource => 
      activeFilters.value.relationType.includes(resource.relationType)
    )
  }

  // Filtres par type de ressource
  if (activeFilters.value.resourceType.length > 0) {
    filtered = filtered.filter(resource => 
      activeFilters.value.resourceType.includes(resource.resourceType)
    )
  }

  // Tri
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'date_desc':
        return new Date(b.submittedAt || b.date) - new Date(a.submittedAt || a.date)
      case 'date_asc':
        return new Date(a.submittedAt || a.date) - new Date(b.submittedAt || b.date)
      case 'title_asc':
        return a.title.localeCompare(b.title)
      case 'title_desc':
        return b.title.localeCompare(a.title)
      case 'popularity':
        return b.likes - a.likes
      default:
        return 0
    }
  })

  return filtered
})

const paginatedResources = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredResources.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredResources.value.length / itemsPerPage)
})

const hasActiveFilters = computed(() => {
  return activeFilters.value.category.length > 0 ||
         activeFilters.value.relationType.length > 0 ||
         activeFilters.value.resourceType.length > 0 ||
         searchQuery.value.length > 0
})

const activeFilterChips = computed(() => {
  const chips = []
  
  activeFilters.value.category.forEach(value => {
    const category = categories.find(c => c.value === value)
    if (category) {
      chips.push({
        key: `category-${value}`,
        type: 'category',
        value,
        label: category.label
      })
    }
  })
  
  activeFilters.value.relationType.forEach(value => {
    const relationType = relationTypes.find(r => r.value === value)
    if (relationType) {
      chips.push({
        key: `relationType-${value}`,
        type: 'relationType',
        value,
        label: relationType.label
      })
    }
  })
  
  activeFilters.value.resourceType.forEach(value => {
    const resourceType = resourceTypes.find(r => r.value === value)
    if (resourceType) {
      chips.push({
        key: `resourceType-${value}`,
        type: 'resourceType',
        value,
        label: resourceType.label
      })
    }
  })
  
  return chips
})

// Méthodes
const loadResources = async () => {
  isLoading.value = true
  try {
    const result = await getAllResources(false) // false = seulement les ressources approuvées
    if (result.success) {
      resources.value = result.data
    } else {
      console.error('Erreur lors du chargement des ressources:', result.message)
    }
  } catch (error) {
    console.error('Erreur lors du chargement des ressources:', error)
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.back()
}

const toggleFilter = (type, value) => {
  const index = activeFilters.value[type].indexOf(value)
  if (index === -1) {
    activeFilters.value[type].push(value)
  } else {
    activeFilters.value[type].splice(index, 1)
  }
  currentPage.value = 1 // Reset pagination
}

const removeFilter = (type, value) => {
  const index = activeFilters.value[type].indexOf(value)
  if (index !== -1) {
    activeFilters.value[type].splice(index, 1)
  }
}

const resetFilters = () => {
  activeFilters.value = {
    category: [],
    relationType: [],
    resourceType: []
  }
  searchQuery.value = ''
  sortBy.value = 'date_desc'
  currentPage.value = 1
}

const viewResource = (resourceId) => {
  console.log('Viewing resource:', resourceId)
  navigateTo(`/resource/${resourceId}`)
}

const toggleFavorite = (resourceId) => {
  const resource = resources.value.find(r => r.id === resourceId)
  if (resource) {
    resource.isFavorite = !resource.isFavorite
    console.log('Toggled favorite:', resourceId, resource.isFavorite)
  }
}

const shareResource = (resourceId) => {
  console.log('Sharing resource:', resourceId)
  // Implémenter le partage
}

// Watch pour reset pagination quand les filtres changent
watch([searchQuery, sortBy], () => {
  currentPage.value = 1
})

// Charger les ressources au montage
onMounted(() => {
  loadResources()
})

// SEO
useSeoMeta({
  title: 'Ressources - Ressources Relationnelles',
  description: 'Découvrez et filtrez les ressources par catégorie, type de relation et type de ressource'
})
</script> 