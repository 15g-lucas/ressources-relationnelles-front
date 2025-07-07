<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
    <!-- Header avec l'inviteur -->
    <div class="flex items-start space-x-3 mb-3">
      <img 
        :src="invitation.inviter.photo" 
        :alt="invitation.inviter.prenom"
        class="w-10 h-10 rounded-full"
      />
      <div class="flex-1 min-w-0">
        <div class="flex items-center space-x-2">
          <h4 class="font-medium text-gray-900 text-sm">
            {{ invitation.inviter.prenom }} {{ invitation.inviter.nom }}
          </h4>
          <span class="text-xs text-gray-500">vous invite</span>
        </div>
        <p class="text-xs text-gray-500 mt-1">{{ formatTimeAgo(invitation.invitedAt) }}</p>
      </div>
      <div class="flex-shrink-0">
        <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
          Invitation
        </span>
      </div>
    </div>

    <!-- Détails de l'activité -->
    <div class="bg-gray-50 rounded-lg p-3 mb-3">
      <h3 class="font-semibold text-gray-900 mb-2">{{ invitation.activity.title }}</h3>
      
      <div class="space-y-2">
        <div class="flex items-center space-x-2 text-sm text-gray-600">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{{ formatDate(invitation.activity.date) }}</span>
        </div>
        
        <div class="flex items-center space-x-2 text-sm text-gray-600">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{{ invitation.activity.location }}</span>
        </div>
      </div>
    </div>

    <!-- Message personnel -->
    <div v-if="invitation.message" class="mb-4">
      <div class="bg-blue-50 border-l-4 border-blue-200 p-3 rounded-r-lg">
        <div class="flex items-start space-x-2">
          <svg class="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd" />
          </svg>
          <p class="text-sm text-blue-800 italic">{{ invitation.message }}</p>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-between space-x-3">
      <div class="flex space-x-2 flex-1">
        <button 
          @click="$emit('accept', invitation.id)"
          class="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Accepter</span>
        </button>
        
        <button 
          @click="$emit('decline', invitation.id)"
          class="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>Décliner</span>
        </button>
      </div>
      
      <button 
        @click="viewActivity"
        class="text-sm text-blue-500 hover:text-blue-600 transition-colors px-2"
      >
        Voir détails
      </button>
    </div>

    <!-- État d'urgence si l'activité est bientôt -->
    <div v-if="isUrgent" class="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
      <div class="flex items-center space-x-2">
        <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <p class="text-sm text-orange-700">
          <strong>Réponse rapide souhaitée</strong> - Cette activité a lieu {{ timeUntilActivity }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  invitation: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['accept', 'decline'])

// Calculer si l'invitation est urgente (activité dans moins de 48h)
const isUrgent = computed(() => {
  const activityDate = new Date(props.invitation.activity.date)
  const now = new Date()
  const hoursUntil = (activityDate - now) / (1000 * 60 * 60)
  return hoursUntil <= 48 && hoursUntil > 0
})

const timeUntilActivity = computed(() => {
  const activityDate = new Date(props.invitation.activity.date)
  const now = new Date()
  const diff = activityDate - now
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days > 0) {
    return `dans ${days} jour${days > 1 ? 's' : ''}`
  } else if (hours > 0) {
    return `dans ${hours} heure${hours > 1 ? 's' : ''}`
  } else {
    return 'très bientôt'
  }
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatTimeAgo = (date) => {
  const now = new Date()
  const inviteDate = new Date(date)
  const diff = now - inviteDate
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`
  if (hours > 0) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`
  if (minutes > 0) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`
  return 'À l\'instant'
}

const viewActivity = () => {
  navigateTo(`/activity/${props.invitation.activity.id}`)
}
</script>