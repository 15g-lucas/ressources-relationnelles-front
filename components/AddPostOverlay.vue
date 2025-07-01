<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl space-y-4">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <button @click="$emit('close')" class="p-2 hover:bg-gray-100 rounded-full">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h2 class="text-lg font-semibold">Créer un post</h2>
        <div class="w-8"></div> <!-- Spacer -->
      </div>

      <!-- Visibility selector -->
      <div class="flex items-center justify-between bg-gray-100 rounded-full px-4 py-2">
        <span class="text-sm text-gray-600">Qui peut voir le post ?</span>
        <select 
          v-model="selectedVisibility" 
          class="bg-transparent text-sm font-medium border-none outline-none"
        >
          <option value="public">Choisissez</option>
          <option value="friends">Amis seulement</option>
          <option value="family">Famille seulement</option>
          <option value="custom">Personnalisé</option>
        </select>
      </div>

      <!-- Custom visibility options (shown when "Personnalisé" is selected) -->
      <div v-if="selectedVisibility === 'custom'" class="space-y-3">
        <h3 class="font-medium text-gray-700">Sélectionnez qui peut voir :</h3>
        
        <label class="flex items-center justify-between">
          <span>Famille</span>
          <input 
            type="checkbox" 
            v-model="visibilityOptions.famille"
            class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          >
        </label>
        
        <label class="flex items-center justify-between">
          <span>Amis</span>
          <input 
            type="checkbox" 
            v-model="visibilityOptions.amis"
            class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          >
        </label>
        
        <label class="flex items-center justify-between">
          <span>Collègues</span>
          <input 
            type="checkbox" 
            v-model="visibilityOptions.collegues"
            class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          >
        </label>
        
        <label class="flex items-center justify-between">
          <span>Autre</span>
          <input 
            type="checkbox" 
            v-model="visibilityOptions.autre"
            class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          >
        </label>
      </div>

      <!-- Text area -->
      <div class="bg-gray-50 rounded-lg p-4">
        <textarea
          v-model="content"
          rows="4"
          class="w-full bg-transparent border-none outline-none resize-none placeholder-gray-500"
          placeholder="Add your text here"
        ></textarea>
        
        <!-- Media buttons -->
        <div class="flex space-x-4 mt-3">
          <button class="flex items-center space-x-2 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span class="text-sm">Ajouter image</span>
          </button>
          
          <button class="flex items-center space-x-2 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            <span class="text-sm">Ajouter vidéo</span>
          </button>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex justify-end space-x-3 pt-2">
        <button 
          @click="$emit('close')" 
          class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Annuler
        </button>
        <button 
          @click="submitPost" 
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          :disabled="!content.trim()"
          :class="{ 'opacity-50 cursor-not-allowed': !content.trim() }"
        >
          Publier
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const content = ref('')
const selectedVisibility = ref('public')

const visibilityOptions = reactive({
  famille: true,
  amis: true,
  collegues: true,
  autre: true
})

const emit = defineEmits(['close', 'submit-post'])

function submitPost() {
  if (!content.value.trim()) {
    alert('Ton post est vide !')
    return
  }

  const postData = {
    content: content.value,
    visibility: selectedVisibility.value,
    visibilityOptions: selectedVisibility.value === 'custom' ? { ...visibilityOptions } : null
  }

  emit('submit-post', postData)
  
  // Reset form
  content.value = ''
  selectedVisibility.value = 'public'
  visibilityOptions.famille = true
  visibilityOptions.amis = true
  visibilityOptions.collegues = true
  visibilityOptions.autre = true
  
  emit('close')
}
</script>