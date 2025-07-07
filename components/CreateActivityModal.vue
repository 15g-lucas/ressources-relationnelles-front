<template>
  <!-- Overlay -->
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
    <!-- Modal -->
    <div class="bg-white w-full sm:max-w-lg sm:rounded-lg overflow-hidden transform transition-all max-h-screen overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900">Créer une activité</h2>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Formulaire -->
      <form @submit.prevent="createActivity" class="p-4 space-y-4">
        <!-- Titre -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
            Titre de l'activité *
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            placeholder="Ex: Atelier de networking créatif"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            required
            placeholder="Décrivez votre activité et ce que les participants peuvent attendre..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          ></textarea>
          <div class="flex justify-between items-center mt-1">
            <span class="text-xs text-gray-500">{{ form.description.length }}/500 caractères</span>
          </div>
        </div>

        <!-- Type et Catégorie -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="type" class="block text-sm font-medium text-gray-700 mb-1">
              Type *
            </label>
            <select
              id="type"
              v-model="form.type"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choisir...</option>
              <option value="workshop">Atelier</option>
              <option value="game">Jeu</option>
              <option value="social">Social</option>
              <option value="sport">Sport</option>
              <option value="cultural">Culturel</option>
              <option value="educational">Éducatif</option>
              <option value="networking">Networking</option>
            </select>
          </div>

          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
              Catégorie *
            </label>
            <select
              id="category"
              v-model="form.category"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choisir...</option>
              <option value="networking">Networking</option>
              <option value="development">Développement</option>
              <option value="wellness">Bien-être</option>
              <option value="culture">Culture</option>
              <option value="sport">Sport</option>
              <option value="education">Éducation</option>
              <option value="business">Business</option>
            </select>
          </div>
        </div>

        <!-- Date et Heure -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="date" class="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              id="date"
              v-model="form.date"
              type="date"
              required
              :min="minDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label for="time" class="block text-sm font-medium text-gray-700 mb-1">
              Heure *
            </label>
            <input
              id="time"
              v-model="form.time"
              type="time"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Durée -->
        <div>
          <label for="duration" class="block text-sm font-medium text-gray-700 mb-1">
            Durée (minutes) *
          </label>
          <select
            id="duration"
            v-model="form.duration"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choisir...</option>
            <option value="30">30 minutes</option>
            <option value="60">1 heure</option>
            <option value="90">1h30</option>
            <option value="120">2 heures</option>
            <option value="180">3 heures</option>
            <option value="240">4 heures</option>
            <option value="480">Journée complète</option>
          </select>
        </div>

        <!-- Lieu -->
        <div>
          <label for="location" class="block text-sm font-medium text-gray-700 mb-1">
            Lieu *
          </label>
          <input
            id="location"
            v-model="form.location"
            type="text"
            required
            placeholder="Ex: Café Central, 123 Rue de la Paix, Paris"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Participants et Prix -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="maxParticipants" class="block text-sm font-medium text-gray-700 mb-1">
              Nb max participants *
            </label>
            <input
              id="maxParticipants"
              v-model.number="form.maxParticipants"
              type="number"
              min="2"
              max="100"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label for="cost" class="block text-sm font-medium text-gray-700 mb-1">
              Prix (€)
            </label>
            <input
              id="cost"
              v-model.number="form.cost"
              type="number"
              min="0"
              step="0.01"
              placeholder="0 = gratuit"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Tags -->
        <div>
          <label for="tags" class="block text-sm font-medium text-gray-700 mb-1">
            Tags (séparés par des virgules)
          </label>
          <input
            id="tags"
            v-model="form.tagsInput"
            type="text"
            placeholder="Ex: networking, créativité, innovation"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p class="text-xs text-gray-500 mt-1">Ajoutez des mots-clés pour aider les participants à trouver votre activité</p>
        </div>

        <!-- Image (optionnel) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Image (optionnel)
          </label>
          <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
            <div class="space-y-1 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="text-sm text-gray-600">
                <button type="button" class="font-medium text-blue-600 hover:text-blue-500">
                  Télécharger une image
                </button>
                <p class="pl-1">ou glissez-déposez</p>
              </div>
              <p class="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
            </div>
          </div>
        </div>

        <!-- Options avancées -->
        <div class="border-t border-gray-200 pt-4">
          <h3 class="text-sm font-medium text-gray-900 mb-3">Options avancées</h3>
          
          <div class="space-y-3">
            <label class="flex items-center">
              <input
                v-model="form.isPrivate"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">Activité privée (sur invitation uniquement)</span>
            </label>

            <label class="flex items-center">
              <input
                v-model="form.allowInvitations"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">Permettre aux participants d'inviter d'autres personnes</span>
            </label>

            <label class="flex items-center">
              <input
                v-model="form.requireApproval"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">Approuver manuellement les participants</span>
            </label>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            :disabled="!isFormValid || isCreating"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="isCreating">Création...</span>
            <span v-else>Créer l'activité</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const { user } = useAuth()

const emit = defineEmits(['close', 'created'])

// États
const isCreating = ref(false)

// Formulaire
const form = reactive({
  title: '',
  description: '',
  type: '',
  category: '',
  date: '',
  time: '',
  duration: '',
  location: '',
  maxParticipants: 8,
  cost: 0,
  tagsInput: '',
  isPrivate: false,
  allowInvitations: true,
  requireApproval: false
})

// Date minimum (aujourd'hui)
const minDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

// Validation du formulaire
const isFormValid = computed(() => {
  return form.title.trim() &&
         form.description.trim() &&
         form.type &&
         form.category &&
         form.date &&
         form.time &&
         form.duration &&
         form.location.trim() &&
         form.maxParticipants >= 2
})

// Méthodes
const createActivity = async () => {
  if (!isFormValid.value) return

  isCreating.value = true

  try {
    // Combiner date et heure
    const activityDate = new Date(`${form.date}T${form.time}`)
    
    // Traiter les tags
    const tags = form.tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    // Créer l'objet activité
    const newActivity = {
      id: Date.now(),
      title: form.title,
      description: form.description,
      type: form.type,
      category: form.category,
      date: activityDate,
      duration: parseInt(form.duration),
      location: form.location,
      maxParticipants: form.maxParticipants,
      currentParticipants: 1, // Le créateur
      cost: form.cost || 0,
      tags: tags,
      isPrivate: form.isPrivate,
      allowInvitations: form.allowInvitations,
      requireApproval: form.requireApproval,
      creator: {
        id: user.value?.id || 1,
        prenom: user.value?.prenom || 'Vous',
        nom: user.value?.nom || '',
        photo: user.value?.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
      },
      participants: [{
        id: user.value?.id || 1,
        prenom: user.value?.prenom || 'Vous',
        nom: user.value?.nom || '',
        photo: user.value?.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop'
      }],
      isJoined: true,
      image: getRandomActivityImage(form.type)
    }

    // Simuler l'API
    await new Promise(resolve => setTimeout(resolve, 1000))

    emit('created', newActivity)
    
    // Reset form
    Object.keys(form).forEach(key => {
      if (typeof form[key] === 'string') form[key] = ''
      else if (typeof form[key] === 'number') form[key] = key === 'maxParticipants' ? 8 : 0
      else if (typeof form[key] === 'boolean') form[key] = key === 'allowInvitations'
    })

  } catch (error) {
    console.error('Erreur lors de la création de l\'activité:', error)
    alert('Une erreur est survenue lors de la création de l\'activité')
  } finally {
    isCreating.value = false
  }
}

// Obtenir une image aléatoire selon le type
const getRandomActivityImage = (type) => {
  const images = {
    workshop: [
      'https://images.unsplash.com/photo-1559523275-98fb3c56faf6?w=400&h=200&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop'
    ],
    game: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop',
      'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=200&fit=crop'
    ],
    social: [
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&h=200&fit=crop',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop'
    ],
    networking: [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop',
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=200&fit=crop'
    ]
  }
  
  const typeImages = images[type] || images.social
  return typeImages[Math.floor(Math.random() * typeImages.length)]
}

// Fermer avec Escape
const handleKeydown = (e) => {
  if (e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>