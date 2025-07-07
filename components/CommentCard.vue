<template>
  <div class="p-4 hover:bg-gray-50 transition-colors">
    <div class="flex items-start space-x-3">
      <img 
        :src="comment.user.photo" 
        :alt="comment.user.prenom"
        class="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
        style="border-radius: 50% !important;"
      />
      <div class="flex-1 min-w-0">
        <div class="flex items-center space-x-2">
          <h5 class="font-medium text-gray-900 text-sm">
            {{ comment.user.prenom }} {{ comment.user.nom }}
          </h5>
          <span class="text-xs text-gray-500">{{ formatDate(comment.created_at) }}</span>
        </div>
        <p class="text-gray-700 text-sm mt-1 leading-relaxed">{{ comment.content }}</p>
        
        <!-- Actions du commentaire -->
        <div class="flex items-center space-x-4 mt-2">
          <button 
            @click="toggleLike"
            :class="[
              'flex items-center space-x-1 text-xs transition-colors',
              isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            ]"
          >
            <svg 
              :class="['w-3 h-3', isLiked ? 'fill-current' : '']"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{{ likesCount }}</span>
          </button>
          
          <button 
            @click="$emit('reply', comment)"
            class="text-xs text-gray-500 hover:text-blue-500 transition-colors"
          >
            Répondre
          </button>
          
          <button 
            v-if="isOwner"
            @click="$emit('delete', comment.id)"
            class="text-xs text-gray-500 hover:text-red-500 transition-colors"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  comment: {
    type: Object,
    required: true
  },
  currentUserId: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['like', 'reply', 'delete'])

// État local
const isLiked = ref(props.comment.is_liked || false)
const likesCount = ref(props.comment.likes_count || 0)

// Computed
const isOwner = computed(() => {
  return props.currentUserId === props.comment.user?.id
})

// Méthodes
const toggleLike = () => {
  isLiked.value = !isLiked.value
  likesCount.value += isLiked.value ? 1 : -1
  
  emit('like', {
    commentId: props.comment.id,
    isLiked: isLiked.value
  })
}

const formatDate = (date) => {
  const now = new Date()
  const commentDate = new Date(date)
  const diff = now - commentDate
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return 'À l\'instant'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}j`
  
  return commentDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  })
}

// Watch pour les changements externes
watch(() => props.comment.is_liked, (newValue) => {
  isLiked.value = newValue
})

watch(() => props.comment.likes_count, (newValue) => {
  likesCount.value = newValue
})
</script> 