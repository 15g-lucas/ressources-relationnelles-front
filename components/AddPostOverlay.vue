<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl space-y-4">
      <h2 class="text-xl font-semibold">Créer un post</h2>
      <textarea
        v-model="content"
        rows="4"
        class="w-full p-2 border border-gray-300 rounded resize-none"
        placeholder="Écris ton post ici..."
      ></textarea>
      <div class="flex justify-end space-x-2">
        <button @click="$emit('close')" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Annuler</button>
        <button @click="submitPost" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Publier</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const content = ref('')
const emit = defineEmits(['close', 'submit-post'])

function submitPost() {
  if (!content.value.trim()) return alert('Ton post est vide !')
  emit('submit-post', content.value)
  content.value = ''
  emit('close')
}
</script>

