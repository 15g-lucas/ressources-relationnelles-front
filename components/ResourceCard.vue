<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
    <!-- Image de la ressource -->
    <div v-if="resource.image" class="relative">
      <img 
        :src="resource.image" 
        :alt="resource.title"
        class="w-full h-32 object-cover"
      />
      <div class="absolute top-2 right-2">
        <span :class="[
          'px-2 py-1 rounded-full text-xs font-medium',
          getResourceTypeColor(resource.resourceType)
        ]">
          {{ getResourceTypeLabel(resource.resourceType) }}
        </span>
      </div>
    </div>
    
    <!-- Contenu -->
    <div class="p-4">
      <!-- Header avec catégorie et date -->
      <div class="flex items-center justify-between mb-2">
        <span :class="[
          'px-2 py-1 rounded-full text-xs font-medium',
          getCategoryColor(resource.category)
        ]">
          {{ getCategoryLabel(resource.category) }}
        </span>
        <span class="text-xs text-gray-500">{{ formatDate(resource.date) }}</span>
      </div>
      
      <!-- Titre -->
      <h3 class="font-semibold text-gray-900 text-sm leading-tight mb-2 line-clamp-2">
        {{ resource.title }}
      </h3>
      
      <!-- Description -->
      <p class="text-gray-600 text-xs leading-relaxed mb-3 line-clamp-3">
        {{ resource.description }}
      </p>
      
      <!-- Auteur et type de relation -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center space-x-2">
          <svg class="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
          <span class="text-xs text-gray-600">{{ resource.author }}</span>
        </div>
        <span :class="[
          'px-2 py-1 rounded-full text-xs font-medium',
          getRelationTypeColor(resource.relationType)
        ]">
          {{ getRelationTypeLabel(resource.relationType) }}
        </span>
      </div>
      
      <!-- Tags -->
      <div class="flex flex-wrap gap-1 mb-3">
        <span 
          v-for="tag in resource.tags?.slice(0, 3)" 
          :key="tag"
          class="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
        >
          #{{ tag }}
        </span>
        <span 
          v-if="resource.tags?.length > 3"
          class="text-gray-400 text-xs"
        >
          +{{ resource.tags.length - 3 }}
        </span>
      </div>
      
      <!-- Actions -->
      <div class="flex items-center justify-between pt-2 border-t border-gray-100">
        <div class="flex items-center space-x-3">
          <button 
            @click="$emit('favorite', resource.id)"
            :class="[
              'flex items-center space-x-1 text-xs transition-colors',
              resource.isFavorite ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'
            ]"
          >
            <svg 
              :class="['w-3 h-3', resource.isFavorite ? 'fill-current' : '']"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span>{{ resource.likes }}</span>
          </button>
          
          <button 
            @click="$emit('share', resource.id)"
            class="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-500 transition-colors"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span>Partager</span>
          </button>
        </div>
        
        <button 
          @click="$emit('view', resource.id)"
          class="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors"
        >
          Voir plus
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  resource: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['view', 'favorite', 'share'])

// Labels des catégories
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

// Labels des types de relation
const relationTypeLabels = {
  professionnel: 'Professionnel',
  personnel: 'Personnel',
  familial: 'Familial',
  amical: 'Amical',
  mentor: 'Mentorat',
  commercial: 'Commercial'
}

// Labels des types de ressource
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

// Méthodes pour les couleurs des badges
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

// Méthodes pour les labels
const getCategoryLabel = (category) => {
  return categoryLabels[category] || category
}

const getRelationTypeLabel = (relationType) => {
  return relationTypeLabels[relationType] || relationType
}

const getResourceTypeLabel = (resourceType) => {
  return resourceTypeLabels[resourceType] || resourceType
}

const formatDate = (date) => {
  const now = new Date()
  const resourceDate = new Date(date)
  const diff = now - resourceDate
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'Aujourd\'hui'
  if (days === 1) return 'Hier'
  if (days < 7) return `${days} jours`
  if (days < 30) return `${Math.floor(days / 7)} sem.`
  
  return resourceDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 