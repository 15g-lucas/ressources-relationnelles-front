<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden hover:shadow-lg hover:border-gray-300/80 transition-all duration-300 h-fit group">
    <!-- Layout horizontal : image à gauche, contenu à droite -->
    <div class="flex">
      <!-- Image de l'activité -->
      <div v-if="activity.image" class="relative flex-shrink-0">
        <img 
          :src="activity.image" 
          :alt="activity.title"
          class="w-28 h-28 object-cover group-hover:scale-105 transition-transform duration-300"
          @error="handleImageError"
        />
        <!-- Badge type d'activité avec dégradé -->
        <div class="absolute top-2 left-2">
          <span :class="[
            'px-2 py-1 rounded-lg text-xs font-bold shadow-lg backdrop-blur-sm',
            getTypeColor(activity.type)
          ]">
            {{ getTypeLabel(activity.type) }}
          </span>
        </div>
        <!-- Badge prix avec design amélioré -->
        <div class="absolute bottom-2 right-2">
          <span v-if="activity.cost > 0" class="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
            {{ activity.cost }}€
          </span>
          <span v-else class="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
            Gratuit
          </span>
        </div>
      </div>
      
      <!-- Contenu -->
      <div class="flex-1 p-4 min-w-0">
        <!-- Header avec date et durée -->
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center space-x-2 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
            <svg class="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="font-semibold">{{ formatDate(activity.date) }}</span>
          </div>
          <div class="flex items-center space-x-1.5 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
            <svg class="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="font-medium">{{ activity.duration }}min</span>
          </div>
        </div>
        
        <!-- Titre -->
        <h3 class="font-bold text-gray-900 text-sm leading-tight mb-2 truncate group-hover:text-blue-600 transition-colors">
          {{ activity.title }}
        </h3>
        
        <!-- Description -->
        <p class="text-gray-600 text-xs leading-relaxed mb-3 line-clamp-1">
          {{ activity.description }}
        </p>
        
        <!-- Lieu et organisateur avec design amélioré -->
        <div class="space-y-2 mb-3">
          <div class="flex items-center space-x-2">
            <div class="w-6 h-6 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span class="text-xs text-gray-700 truncate font-medium">{{ activity.location }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <img 
              :src="activity.creator.photo" 
              :alt="activity.creator.prenom"
              class="w-6 h-6 rounded-full border-2 border-white shadow-sm flex-shrink-0"
              @error="handleAvatarError"
            />
            <span class="text-xs text-gray-700 truncate">{{ activity.creator.prenom }} {{ activity.creator.nom }}</span>
          </div>
        </div>
        
        <!-- Participants avec design moderne -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-2">
            <div class="flex -space-x-1">
              <img 
                v-for="participant in activity.participants.slice(0, 2)" 
                :key="participant.id"
                :src="participant.photo" 
                :alt="participant.prenom"
                class="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                @error="handleAvatarError"
              />
              <div 
                v-if="activity.participants.length > 2"
                class="w-5 h-5 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-white shadow-sm flex items-center justify-center"
              >
                <span class="text-xs text-gray-600 font-bold leading-none">+{{ activity.participants.length - 2 }}</span>
              </div>
            </div>
            <span class="text-xs text-gray-600 font-medium">
              {{ activity.currentParticipants }}/{{ activity.maxParticipants }}
            </span>
          </div>
          
          <!-- Jauge de remplissage moderne -->
          <div class="w-16 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              :class="[
                'h-2 rounded-full transition-all duration-500 ease-out',
                getParticipationColor(activity.currentParticipants / activity.maxParticipants)
              ]"
              :style="{ width: `${Math.min((activity.currentParticipants / activity.maxParticipants) * 100, 100)}%` }"
            ></div>
          </div>
        </div>
        
        <!-- Actions avec style moderne -->
        <div v-if="!isPast" class="flex items-center justify-between pt-3 border-t border-gray-100">
          <!-- Actions pour le créateur -->
          <div v-if="isCreator" class="flex items-center space-x-3">
            <button 
              @click="$emit('edit', activity.id)"
              class="text-xs text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Modifier
            </button>
            
            <button 
              @click="$emit('invite', activity)"
              class="text-xs text-blue-600 hover:text-blue-700 transition-colors font-medium"
            >
              Inviter
            </button>
            
            <button 
              @click="$emit('cancel', activity.id)"
              class="text-xs text-red-500 hover:text-red-600 transition-colors font-medium"
            >
              Annuler
            </button>
          </div>
          
          <!-- Actions pour les participants -->
          <div v-else class="flex items-center space-x-2">
            <button 
              v-if="!activity.isJoined && activity.currentParticipants < activity.maxParticipants"
              @click="$emit('join', activity.id)"
              class="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm"
            >
              Rejoindre
            </button>
            
            <button 
              v-else-if="activity.isJoined"
              @click="$emit('leave', activity.id)"
              class="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm"
            >
              Quitter
            </button>
            
            <div 
              v-else
              class="text-xs text-gray-500 px-3 py-1.5 bg-gray-100 rounded-lg font-medium"
            >
              Complet
            </div>
            
            <button 
              @click="$emit('invite', activity)"
              class="text-xs text-blue-600 hover:text-blue-700 transition-colors font-medium"
            >
              Inviter
            </button>
          </div>
          
          <button 
            @click="$emit('view', activity.id)"
            class="text-xs text-gray-600 hover:text-gray-800 transition-colors font-medium"
          >
            Détails
          </button>
        </div>
        
        <!-- Actions pour activités passées -->
        <div v-else class="flex items-center justify-between pt-3 border-t border-gray-100">
          <span class="text-xs text-gray-500 font-medium">Terminée</span>
          <button 
            @click="$emit('view', activity.id)"
            class="text-xs text-blue-600 hover:text-blue-700 transition-colors font-medium"
          >
            Détails
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  activity: {
    type: Object,
    required: true
  },
  currentUserId: {
    type: Number,
    default: null
  },
  isCreator: {
    type: Boolean,
    default: false
  },
  isPast: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['join', 'leave', 'invite', 'view', 'edit', 'cancel'])

// Labels des types d'activité
const typeLabels = {
  workshop: 'Atelier',
  game: 'Jeu',
  social: 'Social',
  sport: 'Sport',
  cultural: 'Culturel',
  educational: 'Éducatif',
  networking: 'Networking'
}

// Couleurs des types avec dégradés
const getTypeColor = (type) => {
  const colors = {
    workshop: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
    game: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
    social: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
    sport: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white',
    cultural: 'bg-gradient-to-r from-pink-500 to-pink-600 text-white',
    educational: 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white',
    networking: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
  }
  return colors[type] || 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
}

const getTypeLabel = (type) => {
  return typeLabels[type] || type
}

// Couleur de la jauge selon le taux de remplissage avec dégradés
const getParticipationColor = (ratio) => {
  if (ratio >= 0.8) return 'bg-gradient-to-r from-red-400 to-red-500'
  if (ratio >= 0.6) return 'bg-gradient-to-r from-yellow-400 to-yellow-500'
  return 'bg-gradient-to-r from-green-400 to-green-500'
}

const formatDate = (date) => {
  const now = new Date()
  const activityDate = new Date(date)
  const diff = activityDate - now
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours <= 0) return 'Maintenant'
    return `Dans ${hours}h`
  }
  if (days === 1) return 'Demain'
  if (days < 7) return `Dans ${days} jours`
  
  return activityDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Gestion des erreurs d'images
const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/400x200/f3f4f6/9ca3af?text=Image+non+disponible'
}

const handleAvatarError = (event) => {
  const seed = Math.random().toString(36).substring(7)
  event.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=e5e7eb`
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>