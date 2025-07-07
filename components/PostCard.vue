<template>
  <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
    <!-- Header du post -->
    <div class="p-4 flex items-start space-x-3">
      <img 
        :src="post.user?.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'" 
        :alt="post.user?.prenom || 'Utilisateur'"
        class="user-avatar"
        @error="handleImageError"
        loading="lazy"
        style="border-radius: 50% !important; width: 40px; height: 40px; object-fit: cover;"
      />
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="font-medium text-gray-900 text-sm">
              {{ post.user?.prenom }} {{ post.user?.nom }}
            </h4>
            <p class="text-xs text-gray-500">{{ formatDate(post.created_at) }}</p>
          </div>
          <button 
            v-if="isOwner"
            @click="$emit('delete', post.id)"
            class="text-gray-400 hover:text-red-500 p-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        
        <!-- Contenu du post -->
        <div class="mt-2">
          <p class="text-gray-800 text-sm leading-relaxed">{{ post.content }}</p>
        </div>
      </div>
    </div>
    
    <!-- Image du post -->
    <div v-if="post.image" class="px-4 pb-2">
      <div class="relative">
        <img 
          :src="post.image" 
          alt="Image du post"
          class="post-image"
          @click="$emit('viewImage', post.image)"
          @error="handlePostImageError"
          loading="lazy"
        />
        <div class="image-overlay" @click="$emit('viewImage', post.image)"></div>
      </div>
    </div>
    
    <!-- Actions du post -->
    <div class="px-4 pb-4">
      <div class="flex items-center justify-between pt-2 border-t border-gray-100">
        <div class="flex items-center space-x-4">
          <button 
            @click="toggleLike"
            :class="[
              'flex items-center space-x-1 text-sm transition-colors',
              isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            ]"
          >
            <svg 
              :class="['w-4 h-4', isLiked ? 'fill-current' : '']"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{{ likesCount }}</span>
          </button>
          
          <button 
            @click="$emit('showComments', post.id)"
            class="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-500 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{{ post.comments_count || 0 }}</span>
          </button>
          
          <button 
            @click="toggleSave"
            :class="[
              'flex items-center space-x-1 text-sm transition-colors',
              isSaved ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'
            ]"
            :title="isSaved ? 'Post enregistré' : 'Enregistrer le post'"
          >
            <svg 
              :class="['w-4 h-4', isSaved ? 'fill-current' : '']"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span class="hidden sm:inline">{{ isSaved ? 'Enregistré' : 'Enregistrer' }}</span>
          </button>
          
          <button 
            @click="toggleExploited"
            :class="[
              'flex items-center space-x-1 text-sm transition-colors',
              isExploited ? 'text-green-500' : 'text-gray-500 hover:text-green-500'
            ]"
            :title="isExploited ? 'Marqué comme exploité' : 'Marquer comme exploité'"
          >
            <svg 
              :class="['w-4 h-4', isExploited ? 'fill-current' : '']"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="hidden sm:inline">{{ isExploited ? 'Exploité' : 'Exploiter' }}</span>
          </button>
        </div>
        
        <button 
          @click="$emit('share', post.id)"
          class="flex items-center space-x-1 text-sm text-gray-500 hover:text-indigo-500 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          <span class="hidden sm:inline">Partager</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  currentUserId: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['like', 'delete', 'showComments', 'share', 'viewImage', 'save', 'exploit'])

// État local
const isLiked = ref(props.post.is_liked || false)
const likesCount = ref(props.post.likes_count || 0)
const isSaved = ref(props.post.is_saved || false)
const isExploited = ref(props.post.is_exploited || false)

// Computed
const isOwner = computed(() => {
  return props.currentUserId === props.post.user?.id
})

// Méthodes
const toggleLike = async () => {
  // Optimistic update
  const wasLiked = isLiked.value
  isLiked.value = !wasLiked
  likesCount.value += wasLiked ? -1 : 1
  
  try {
    // Appel API
    emit('like', {
      postId: props.post.id,
      isLiked: isLiked.value
    })
  } catch (error) {
    // Rollback en cas d'erreur
    isLiked.value = wasLiked
    likesCount.value += wasLiked ? 1 : -1
    console.error('Erreur toggle like:', error)
  }
}

const toggleSave = async () => {
  // Optimistic update
  const wasSaved = isSaved.value
  isSaved.value = !wasSaved
  
  try {
    // Appel API
    emit('save', {
      postId: props.post.id,
      isSaved: isSaved.value
    })
  } catch (error) {
    // Rollback en cas d'erreur
    isSaved.value = wasSaved
    console.error('Erreur toggle save:', error)
  }
}

const toggleExploited = async () => {
  // Optimistic update
  const wasExploited = isExploited.value
  isExploited.value = !wasExploited
  
  try {
    // Appel API
    emit('exploit', {
      postId: props.post.id,
      isExploited: isExploited.value
    })
  } catch (error) {
    // Rollback en cas d'erreur
    isExploited.value = wasExploited
    console.error('Erreur toggle exploited:', error)
  }
}

const formatDate = (date) => {
  const now = new Date()
  const postDate = new Date(date)
  const diff = now - postDate
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return 'À l\'instant'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}j`
  
  return postDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  })
}

const handleImageError = (event) => {
  // Fallback image en cas d'erreur de chargement
  event.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
}

const handlePostImageError = (event) => {
  // Masquer l'image si elle ne peut pas être chargée
  event.target.style.display = 'none'
}

// Watch pour les changements externes
watch(() => props.post.is_liked, (newValue) => {
  isLiked.value = newValue
})

watch(() => props.post.likes_count, (newValue) => {
  likesCount.value = newValue
})

watch(() => props.post.is_saved, (newValue) => {
  isSaved.value = newValue
})

watch(() => props.post.is_exploited, (newValue) => {
  isExploited.value = newValue
})
</script> 