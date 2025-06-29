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
        <button @click="toggleComments" class="flex items-center space-x-1 hover:text-blue-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>{{ comments.length }}</span>
        </button>

        <!-- Favoris -->
        <button @click="favorites++" class="flex items-center space-x-1 hover:text-red-500 transition-all duration-200 ease-in-out">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{{ favorites }}</span>
        </button>

        <!-- Exploité -->
        <button @click="exploited++" class="flex items-center space-x-1 hover:text-green-500 transition-all duration-200 ease-in-out">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span>{{ exploited }}</span>
        </button>

        <!-- Partages -->
        <button @click="shares++" class="flex items-center space-x-1 hover:text-purple-500 transition-all duration-200 ease-in-out">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <span>{{ shares }}</span>
        </button>

        <!-- Sauvegardes -->
        <button @click="saves++" class="flex items-center space-x-1 hover:text-yellow-500 transition-all duration-200 ease-in-out">
          💾 <span>{{ saves }}</span>
        </button>
      </div>
    </div>

    <!-- Section commentaires -->
    <div v-if="showComments" class="bg-gray-50">
      <!-- Zone de saisie nouveau commentaire -->
      <div class="p-4 border-b border-gray-200 bg-white">
        <div class="flex space-x-3">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" 
            alt="Your avatar" 
            class="w-10 h-10 rounded-full object-cover" 
          >
          <div class="flex-1">
            <textarea
              v-model="newComment"
              placeholder="Écrivez votre commentaire..."
              class="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="2"
            ></textarea>
            <div class="flex justify-end mt-2">
              <button
                @click="addComment"
                :disabled="!newComment.trim()"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
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
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          @add-reply="addReply"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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

const newComment = ref('')
const showComments = ref(false)

const toggleComments = () => {
  showComments.value = !showComments.value
}

const addComment = () => {
  if (!newComment.value.trim()) return

  const comment = {
    id: Date.now(),
    text: newComment.value.trim(),
    author: {
      name: 'Vous',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    replies: []
  }

  emit('add-reply', comment)
  newComment.value = ''
}

const displayTime = computed(() => {
  const date = new Date(props.timestamp)
  return isNaN(date) ? props.timestamp : date.toLocaleString()
})
</script>
