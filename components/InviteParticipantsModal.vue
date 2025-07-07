<template>
  <!-- Overlay -->
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
    <!-- Modal -->
    <div class="bg-white w-full sm:max-w-md sm:rounded-lg overflow-hidden transform transition-all max-h-screen overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900">Inviter des participants</h2>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Informations de l'activité -->
      <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 class="font-medium text-gray-900 text-sm">{{ activity?.title }}</h3>
        <div class="flex items-center space-x-4 mt-1 text-xs text-gray-500">
          <div class="flex items-center space-x-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ formatDate(activity?.date) }}</span>
          </div>
          <div class="flex items-center space-x-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{{ activity?.location }}</span>
          </div>
        </div>
      </div>

      <div class="p-4 space-y-4">
        <!-- Barre de recherche -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Rechercher des contacts</label>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Nom, prénom ou email..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <!-- Participants sélectionnés -->
        <div v-if="selectedParticipants.length > 0" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Participants sélectionnés ({{ selectedParticipants.length }})
          </label>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="participant in selectedParticipants"
              :key="participant.id"
              class="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              <img
                :src="participant.photo"
                :alt="participant.prenom"
                class="w-4 h-4 rounded-full"
              />
              <span>{{ participant.prenom }} {{ participant.nom }}</span>
              <button
                @click="removeParticipant(participant.id)"
                class="text-blue-600 hover:text-blue-800"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Liste des contacts -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Vos contacts</label>
          <div class="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
            <div
              v-for="contact in filteredContacts"
              :key="contact.id"
              @click="toggleParticipant(contact)"
              :class="[
                'flex items-center space-x-3 p-3 cursor-pointer transition-colors',
                isSelected(contact.id) ? 'bg-blue-50' : 'hover:bg-gray-50'
              ]"
            >
              <div class="relative">
                <img
                  :src="contact.photo"
                  :alt="contact.prenom"
                  class="w-8 h-8 rounded-full"
                />
                <div
                  v-if="isSelected(contact.id)"
                  class="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"
                >
                  <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2">
                  <span class="font-medium text-gray-900 text-sm">{{ contact.prenom }} {{ contact.nom }}</span>
                  <span v-if="contact.relation" class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {{ contact.relation }}
                  </span>
                </div>
                <p v-if="contact.email" class="text-xs text-gray-500 truncate">{{ contact.email }}</p>
              </div>
            </div>

            <!-- Aucun contact trouvé -->
            <div v-if="filteredContacts.length === 0" class="p-4 text-center text-gray-500 text-sm">
              <svg class="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p v-if="searchQuery">Aucun contact trouvé pour "{{ searchQuery }}"</p>
              <p v-else>Aucun contact disponible</p>
            </div>
          </div>
        </div>

        <!-- Message personnalisé -->
        <div>
          <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
            Message d'invitation (optionnel)
          </label>
          <textarea
            id="message"
            v-model="invitationMessage"
            rows="3"
            placeholder="Ajoutez un message personnel pour expliquer pourquoi vous les invitez..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
          ></textarea>
          <div class="flex justify-between items-center mt-1">
            <span class="text-xs text-gray-500">{{ invitationMessage.length }}/300 caractères</span>
          </div>
        </div>

        <!-- Options d'invitation -->
        <div class="space-y-3">
          <h4 class="text-sm font-medium text-gray-900">Options</h4>
          
          <label class="flex items-center">
            <input
              v-model="sendReminder"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">Envoyer un rappel 24h avant l'activité</span>
          </label>

          <label class="flex items-center">
            <input
              v-model="allowForwarding"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">Permettre aux invités de partager l'invitation</span>
          </label>
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
            @click="sendInvitations"
            :disabled="selectedParticipants.length === 0 || isSending"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="isSending">Envoi...</span>
            <span v-else>Inviter ({{ selectedParticipants.length }})</span>
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
    default: null
  }
})

const emit = defineEmits(['close', 'invited'])

// États
const searchQuery = ref('')
const selectedParticipants = ref([])
const invitationMessage = ref('')
const sendReminder = ref(true)
const allowForwarding = ref(false)
const isSending = ref(false)

// Contacts disponibles (données d'exemple)
const contacts = ref([
  {
    id: 10,
    prenom: 'Alice',
    nom: 'Dubois',
    email: 'alice.dubois@example.com',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop',
    relation: 'Collègue'
  },
  {
    id: 11,
    prenom: 'Bob',
    nom: 'Martin',
    email: 'bob.martin@example.com',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    relation: 'Ami'
  },
  {
    id: 12,
    prenom: 'Claire',
    nom: 'Leroy',
    email: 'claire.leroy@example.com',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    relation: 'Professionnelle'
  },
  {
    id: 13,
    prenom: 'David',
    nom: 'Rousseau',
    email: 'david.rousseau@example.com',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    relation: 'Mentor'
  },
  {
    id: 14,
    prenom: 'Emma',
    nom: 'Moreau',
    email: 'emma.moreau@example.com',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    relation: 'Collaboratrice'
  },
  {
    id: 15,
    prenom: 'François',
    nom: 'Lefebvre',
    email: 'francois.lefebvre@example.com',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    relation: 'Client'
  },
  {
    id: 16,
    prenom: 'Gabrielle',
    nom: 'Bernard',
    email: 'gabrielle.bernard@example.com',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    relation: 'Partenaire'
  }
])

// Computed
const filteredContacts = computed(() => {
  if (!searchQuery.value) return contacts.value

  const query = searchQuery.value.toLowerCase()
  return contacts.value.filter(contact =>
    contact.prenom.toLowerCase().includes(query) ||
    contact.nom.toLowerCase().includes(query) ||
    contact.email.toLowerCase().includes(query) ||
    contact.relation?.toLowerCase().includes(query)
  )
})

// Méthodes
const isSelected = (contactId) => {
  return selectedParticipants.value.some(p => p.id === contactId)
}

const toggleParticipant = (contact) => {
  const index = selectedParticipants.value.findIndex(p => p.id === contact.id)
  if (index === -1) {
    selectedParticipants.value.push(contact)
  } else {
    selectedParticipants.value.splice(index, 1)
  }
}

const removeParticipant = (contactId) => {
  const index = selectedParticipants.value.findIndex(p => p.id === contactId)
  if (index !== -1) {
    selectedParticipants.value.splice(index, 1)
  }
}

const sendInvitations = async () => {
  if (selectedParticipants.value.length === 0) return

  isSending.value = true

  try {
    // Simuler l'envoi d'invitations
    await new Promise(resolve => setTimeout(resolve, 1500))

    const invitationData = {
      activityId: props.activity?.id,
      participants: selectedParticipants.value,
      message: invitationMessage.value,
      options: {
        sendReminder: sendReminder.value,
        allowForwarding: allowForwarding.value
      }
    }

    console.log('Invitations envoyées:', invitationData)
    
    emit('invited', invitationData)

    // Notification de succès
    alert(`${selectedParticipants.value.length} invitation${selectedParticipants.value.length > 1 ? 's' : ''} envoyée${selectedParticipants.value.length > 1 ? 's' : ''} avec succès !`)

  } catch (error) {
    console.error('Erreur lors de l\'envoi des invitations:', error)
    alert('Une erreur est survenue lors de l\'envoi des invitations')
  } finally {
    isSending.value = false
  }
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Message par défaut basé sur l'activité
watch(() => props.activity, (newActivity) => {
  if (newActivity && !invitationMessage.value) {
    invitationMessage.value = `Salut ! J'aimerais t'inviter à "${newActivity.title}". Je pense que ça pourrait t'intéresser ! 😊`
  }
}, { immediate: true })

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