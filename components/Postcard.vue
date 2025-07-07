<template>
  <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 m-4">
    <!-- Post principal -->
    <div class="p-4 bg-white border-b border-gray-100">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center">
          <img :src="image" alt="Profile" class="w-12 h-12 rounded-full object-cover">
          <div class="ml-3">
            <div class="font-bold text-gray-900">{{ name }}</div>
            <div class="text-gray-500 text-sm">@{{ pseudo }}</div>
          </div>
        </div>
        <div class="text-gray-500 text-sm">{{ displayTime }}</div>
      </div>

      <!-- Titre, description, lien -->
      <div class="mb-2">
        <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
      </div>
      <p class="text-gray-700 text-sm mb-3 whitespace-pre-line">{{ description }}</p>

      <a v-if="url" :href="url" class="text-blue-500 text-sm underline break-all" target="_blank">
        {{ url }}
      </a>

      <!-- Images du post -->
      <div v-if="contentImages && contentImages.length > 0" class="grid grid-cols-1 gap-4 mb-4 mt-4">
        <img
          v-for="(img, index) in contentImages"
          :key="index"
          :src="img"
          alt="Content"
          class="w-full h-auto rounded-lg"
        >
      </div>

      <!-- Actions du post -->
      <div class="flex justify-between items-center pt-3 border-t border-gray-100 text-sm text-gray-500">

      <!-- Commentaires -->
      <button 
        @click="toggleComments"
        aria-label="Afficher les commentaires"
        class="flex items-center space-x-1 hover:text-blue-500 transition-colors duration-200"
      >
        <!-- Icône commentaires -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span>{{ localComments.length }}</span>
      </button>

      <!-- Favoris -->
      <button 
        @click="handleFavorite"
        aria-label="Ajouter aux favoris"
        class="flex items-center space-x-1 hover:text-red-500 transition-colors duration-200 active:scale-95"
        :class="{ 'text-red-500': isFavorited }"
      >
        <!-- Icône cœur -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24"
          :fill="isFavorited ? 'currentColor' : 'none'"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span>{{ currentFavorites }}</span>
      </button>

      <!-- Partages (vert) -->
      <button 
        @click="handleShare"
        aria-label="Partager la publication"
        class="flex items-center space-x-1 hover:text-green-500 transition-colors duration-200 active:scale-95"
        :class="{ 'text-green-500': isShared }"
      >
        <!-- Icône avec 3 ronds et traits -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <span>{{ currentShares }}</span>
      </button>

      <!-- Exploité (jaune) -->
      <button 
        @click="handleExploited"
        aria-label="Marquer comme exploité"
        class="flex items-center space-x-1 hover:text-yellow-500 transition-colors duration-200 active:scale-95"
        :class="{ 'text-yellow-500': isExploited }"
      >
        <!-- Main + cœur -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M2 14c0-.6.4-1 1-1h3.3c.3 0 .5.1.7.3l1.3 1.3h3.7c.4 0 .8.3.9.7l.6 2.2 4.3-1.2c.5-.1 1 .1 1.3.5.3.4.3 1 0 1.4l-.7 1.1c-.3.4-.7.7-1.2.8l-6.6 1.3c-.5.1-1.1 0-1.5-.3l-6-4.2C2.3 16 2 15.5 2 15v-1z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 4.5c0-1.1.9-2 2-2s2 .9 2 2c0 .6-.3 1.2-.8 1.7L12 9l-3.2-2.8C8.3 5.7 8 5.1 8 4.5c0-1.1.9-2 2-2s2 .9 2 2z" />
        </svg>
        <span>{{ currentExploited }}</span>
      </button>

      <!-- Sauvegardes (violet) -->
      <button 
        @click="handleSave"
        aria-label="Sauvegarder la publication"
        class="flex items-center space-x-1 hover:text-purple-500 transition-colors duration-200 active:scale-95"
        :class="{ 'text-purple-500': isSaved }"
      >
        <!-- Icône marque-page -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" 
          :fill="isSaved ? 'currentColor' : 'none'" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <span>{{ currentSaves }}</span>
      </button>
    </div>
    </div>

    <!-- Section commentaires -->
    <div v-if="showComments" class="bg-gray-50">
        <!-- Zone de saisie nouveau commentaire -->
        <div class="p-4 border-b border-gray-200 bg-white">
          <div class="flex space-x-3">
            <img 
              src="https://randomuser.me/api/portraits/lego/1.jpg" 
              alt="Your avatar" 
              class="w-10 h-10 rounded-full object-cover" 
            >
            <div class="flex-1">
              <textarea
                v-model="newComment"
                placeholder="Écrivez votre commentaire..."
                class="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                rows="2"
                @keydown.ctrl.enter="addComment"
              ></textarea>
              <div class="flex justify-end mt-2">
                <button
                  @click="addComment"
                  :disabled="!newComment.trim()"
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
                >
                  Commenter
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Liste des commentaires -->
        <div class="max-h-96 overflow-y-auto">
          <Comment 
            v-for="comment in localComments"
            :key="comment.id"
            :comment="comment"
            @add-reply="addReply"
          />
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Comment from './Comment.vue'

const props = defineProps({
  image: String,         // avatar de l'utilisateur
  name: String,          // nom affiché
  pseudo: String,        // pseudo (@...)
  title: String,         // titre du post
  description: String,   // description texte
  url: String,           // lien optionnel
  contentImages: Array,  // images du post

  favorites: Number,     // nombre de likes/favoris
  exploited: Number,     // nombre d'utilisations ou d'exploitations
  shares: Number,        // nombre de partages
  saves: Number,         // nombre de sauvegardes

  timestamp: String,     // date/heure du post

  comments: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['add-reply'])

// États réactifs
const newComment = ref('')
const showComments = ref(false)

// Copie locale des commentaires pour pouvoir les modifier
const localComments = ref([...props.comments])

// Watcher pour synchroniser avec les props si elles changent
watch(() => props.comments, (newComments) => {
  localComments.value = [...newComments]
}, { deep: true })

// États pour les interactions
const currentFavorites = ref(props.favorites || 0)
const currentExploited = ref(props.exploited || 0)
const currentShares = ref(props.shares || 0)
const currentSaves = ref(props.saves || 0)

const isFavorited = ref(false)
const isExploited = ref(false)
const isShared = ref(false)
const isSaved = ref(false)

const toggleComments = () => {
  showComments.value = !showComments.value
}

const handleFavorite = () => {
  if (!isFavorited.value) {
    currentFavorites.value++
    isFavorited.value = true
  } else {
    currentFavorites.value--
    isFavorited.value = false
  }
}

const handleExploited = () => {
  if (!isExploited.value) {
    currentExploited.value++
    isExploited.value = true
  } else {
    currentExploited.value--
    isExploited.value = false
  }
}

const handleShare = () => {
  if (!isShared.value) {
    currentShares.value++
    isShared.value = true
  } else {
    currentShares.value--
    isShared.value = false
  }
}

const handleSave = () => {
  if (!isSaved.value) {
    currentSaves.value++
    isSaved.value = true
  } else {
    currentSaves.value--
    isSaved.value = false
  }
}

const addComment = () => {
  if (!newComment.value.trim()) return

  const comment = {
    id: Date.now(),
    text: newComment.value.trim(),
    name: 'Vous',
    pseudo: 'you',
    image: 'https://randomuser.me/api/portraits/lego/1.jpg',
    publishedAt: new Date().toISOString(),
    replies: []
  }

  // Ajouter le commentaire à la liste locale
  localComments.value.push(comment)
  
  // Vider le champ de saisie
  newComment.value = ''
  
  // Ouvrir automatiquement les commentaires si ils étaient fermés
  if (!showComments.value) {
    showComments.value = true
  }
}

const addReply = (parentCommentId, replyText) => {
  // Trouver le commentaire parent et ajouter la réponse
  const parentComment = localComments.value.find(comment => comment.id === parentCommentId)
  if (parentComment) {
    if (!parentComment.replies) {
      parentComment.replies = []
    }
    
    const newReply = {
      id: Date.now(),
      text: replyText,
      name: 'Vous',
      pseudo: 'you',
      image: 'https://randomuser.me/api/portraits/lego/1.jpg',
      publishedAt: new Date().toISOString()
    }
    
    parentComment.replies.push(newReply)
  }
}

const displayTime = computed(() => {
  const date = new Date(props.timestamp)
  if (isNaN(date)) return props.timestamp
  
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})
</script>