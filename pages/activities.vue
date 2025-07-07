<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center space-x-3">
          <button 
            @click="goBack"
            class="back-button"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-lg font-semibold text-gray-900">Activités</h1>
        </div>
        <button 
          @click="showCreateActivity = true"
          class="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Créer
        </button>
      </div>
    </header>

    <!-- Filtres rapides -->
    <div class="bg-white border-b border-gray-200 px-4 py-3">
      <div class="flex space-x-2 overflow-x-auto">
        <button
          v-for="filter in quickFilters"
          :key="filter.key"
          @click="currentFilter = filter.key"
          :class="[
            'flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium transition-colors',
            currentFilter === filter.key
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          <span class="mr-1">{{ filter.icon }}</span>
          {{ filter.label }}
          <span v-if="filter.count" class="ml-1 bg-white bg-opacity-30 px-1 rounded text-xs">{{ filter.count }}</span>
        </button>
      </div>
    </div>

    <!-- Liste des activités -->
    <main class="p-4 pb-20">
      <!-- Activités à venir -->
      <div v-if="currentFilter === 'upcoming'">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Activités à venir</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActivityCard
            v-for="activity in upcomingActivities"
            :key="activity.id"
            :activity="activity"
            :current-user-id="user?.id"
            @join="handleJoin"
            @leave="handleLeave"
            @invite="handleInvite"
            @view="viewActivity"
          />
        </div>
      </div>

      <!-- Mes activités -->
      <div v-if="currentFilter === 'myActivities'">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Mes activités</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActivityCard
            v-for="activity in myActivities"
            :key="activity.id"
            :activity="activity"
            :current-user-id="user?.id"
            :is-creator="true"
            @edit="editActivity"
            @invite="handleInvite"
            @view="viewActivity"
            @cancel="cancelActivity"
          />
        </div>
      </div>

      <!-- Invitations reçues -->
      <div v-if="currentFilter === 'invitations'">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Invitations reçues</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InvitationCard
            v-for="invitation in pendingInvitations"
            :key="invitation.id"
            :invitation="invitation"
            @accept="acceptInvitation"
            @decline="declineInvitation"
          />
        </div>
      </div>

      <!-- Activités passées -->
      <div v-if="currentFilter === 'past'">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Activités passées</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActivityCard
            v-for="activity in pastActivities"
            :key="activity.id"
            :activity="activity"
            :current-user-id="user?.id"
            :is-past="true"
            @view="viewActivity"
          />
        </div>
      </div>

      <!-- État vide -->
      <div v-if="filteredActivities.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">{{ emptyStateMessage.title }}</h3>
        <p class="mt-1 text-sm text-gray-500">{{ emptyStateMessage.description }}</p>
        <button 
          @click="showCreateActivity = true"
          class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600"
        >
          Créer une activité
        </button>
      </div>
    </main>

    <!-- Modal de création d'activité -->
    <CreateActivityModal
      v-if="showCreateActivity"
      @close="showCreateActivity = false"
      @created="handleActivityCreated"
    />

    <!-- Modal d'invitation -->
    <InviteParticipantsModal
      v-if="showInviteModal"
      :activity="selectedActivity"
      @close="showInviteModal = false"
      @invited="handleParticipantsInvited"
    />
  </div>
</template>

<script setup>
const router = useRouter()
const { user } = useAuth()

// États
const showCreateActivity = ref(false)
const showInviteModal = ref(false)
const selectedActivity = ref(null)
const currentFilter = ref('upcoming')

// Filtres rapides
const quickFilters = [
  { key: 'upcoming', label: 'À venir', icon: '📅', count: null },
  { key: 'myActivities', label: 'Mes activités', icon: '🎯', count: null },
  { key: 'invitations', label: 'Invitations', icon: '📨', count: null },
  { key: 'past', label: 'Passées', icon: '📝', count: null }
]

// Données d'exemple
const activities = ref([
  {
    id: 1,
    title: "Atelier Networking Créatif",
    description: "Venez découvrir de nouvelles techniques de networking dans une ambiance décontractée. Parfait pour créer des liens authentiques !",
    type: "workshop",
    category: "networking",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Dans 3 jours
    duration: 120, // minutes
    location: "Café Coworking Central",
    maxParticipants: 12,
    currentParticipants: 7,
    creator: {
      id: 2,
      prenom: "Marie",
      nom: "Dubois",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=marie&backgroundColor=b6e3f4"
    },
    participants: [
      { id: 2, prenom: "Marie", nom: "Dubois", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=marie&backgroundColor=b6e3f4" },
      { id: 3, prenom: "Pierre", nom: "Martin", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=pierre&backgroundColor=c6f6d5" }
    ],
    tags: ["networking", "créativité", "innovation"],
    isJoined: false,
    cost: 0,
    image: "https://picsum.photos/400/200?random=1"
  },
  {
    id: 2,
    title: "Jeu de Rôle Professionnel",
    description: "Simulation d'entretiens et mises en situation professionnelles. Idéal pour améliorer ses compétences relationnelles.",
    type: "game",
    category: "development",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Dans 5 jours
    duration: 90,
    location: "Salle de formation TechHub",
    maxParticipants: 8,
    currentParticipants: 4,
    creator: {
      id: 3,
      prenom: "Pierre",
      nom: "Martin",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=pierre&backgroundColor=c6f6d5"
    },
    participants: [
      { id: 3, prenom: "Pierre", nom: "Martin", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=pierre&backgroundColor=c6f6d5" }
    ],
    tags: ["jeu", "professionnel", "compétences"],
    isJoined: true,
    cost: 15,
    image: "https://picsum.photos/400/200?random=2"
  },
  {
    id: 3,
    title: "Café Relations & Échanges",
    description: "Moment informel pour échanger sur nos expériences et créer des connections authentiques autour d'un café.",
    type: "social",
    category: "networking",
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Demain
    duration: 60,
    location: "Café des Relations",
    maxParticipants: 15,
    currentParticipants: 9,
    creator: {
      id: 1,
      prenom: user.value?.prenom || "Vous",
      nom: user.value?.nom || "",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=vous&backgroundColor=fde68a"
    },
    participants: [
      { id: 1, prenom: "Vous", nom: "", photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=vous&backgroundColor=fde68a" }
    ],
    tags: ["café", "informel", "échanges"],
    isJoined: true,
    cost: 5,
    image: "https://picsum.photos/400/200?random=3"
  }
])

const invitations = ref([
  {
    id: 1,
    activity: {
      id: 4,
      title: "Session de Brainstorming Collectif",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      location: "Innovation Lab"
    },
    inviter: {
      id: 4,
      prenom: "Sophie",
      nom: "Leroy",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophie&backgroundColor=fbb6ce"
    },
    message: "Salut ! J'organise une session de brainstorming sur l'innovation. Ton expertise serait précieuse !",
    invitedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // Il y a 2 heures
  },
  {
    id: 2,
    activity: {
      id: 5,
      title: "Escape Game Team Building",
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      location: "Escape Room City"
    },
    inviter: {
      id: 5,
      prenom: "Thomas",
      nom: "Rousseau",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=thomas&backgroundColor=c4b5fd"
    },
    message: "Une super activité pour renforcer nos liens d'équipe ! Tu es partant ?",
    invitedAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // Hier
  }
])

// Computed
const upcomingActivities = computed(() => {
  return activities.value.filter(activity => new Date(activity.date) > new Date())
})

const pastActivities = computed(() => {
  return activities.value.filter(activity => new Date(activity.date) < new Date())
})

const myActivities = computed(() => {
  return activities.value.filter(activity => activity.creator.id === user.value?.id)
})

const pendingInvitations = computed(() => {
  return invitations.value
})

const filteredActivities = computed(() => {
  switch (currentFilter.value) {
    case 'upcoming':
      return upcomingActivities.value
    case 'myActivities':
      return myActivities.value
    case 'invitations':
      return pendingInvitations.value
    case 'past':
      return pastActivities.value
    default:
      return []
  }
})

const emptyStateMessage = computed(() => {
  switch (currentFilter.value) {
    case 'upcoming':
      return {
        title: 'Aucune activité à venir',
        description: 'Créez votre première activité pour commencer à inviter des participants !'
      }
    case 'myActivities':
      return {
        title: 'Vous n\'avez créé aucune activité',
        description: 'Organisez votre première activité et invitez vos contacts !'
      }
    case 'invitations':
      return {
        title: 'Aucune invitation en attente',
        description: 'Vous recevrez ici les invitations à des activités.'
      }
    case 'past':
      return {
        title: 'Aucune activité passée',
        description: 'Vos activités terminées apparaîtront ici.'
      }
    default:
      return { title: '', description: '' }
  }
})

// Méthodes
const goBack = () => {
  router.back()
}

const handleJoin = (activityId) => {
  const activity = activities.value.find(a => a.id === activityId)
  if (activity && !activity.isJoined) {
    activity.isJoined = true
    activity.currentParticipants++
    activity.participants.push({
      id: user.value?.id || 1,
      prenom: user.value?.prenom || 'Vous',
      nom: user.value?.nom || '',
      photo: user.value?.photo || 'https://api.dicebear.com/7.x/avataaars/svg?seed=vous&backgroundColor=fde68a'
    })
    console.log('Joined activity:', activityId)
  }
}

const handleLeave = (activityId) => {
  const activity = activities.value.find(a => a.id === activityId)
  if (activity && activity.isJoined) {
    activity.isJoined = false
    activity.currentParticipants--
    activity.participants = activity.participants.filter(p => p.id !== user.value?.id)
    console.log('Left activity:', activityId)
  }
}

const handleInvite = (activity) => {
  selectedActivity.value = activity
  showInviteModal.value = true
}

const viewActivity = (activityId) => {
  navigateTo(`/activity/${activityId}`)
}

const editActivity = (activityId) => {
  console.log('Edit activity:', activityId)
  // TODO: Implémenter l'édition
}

const cancelActivity = (activityId) => {
  const index = activities.value.findIndex(a => a.id === activityId)
  if (index !== -1) {
    activities.value.splice(index, 1)
    console.log('Cancelled activity:', activityId)
  }
}

const acceptInvitation = (invitationId) => {
  const invitationIndex = invitations.value.findIndex(i => i.id === invitationId)
  if (invitationIndex !== -1) {
    const invitation = invitations.value[invitationIndex]
    // Ajouter l'activité aux activités si pas déjà présente
    // et marquer comme rejoint
    invitations.value.splice(invitationIndex, 1)
    console.log('Accepted invitation:', invitationId)
  }
}

const declineInvitation = (invitationId) => {
  const invitationIndex = invitations.value.findIndex(i => i.id === invitationId)
  if (invitationIndex !== -1) {
    invitations.value.splice(invitationIndex, 1)
    console.log('Declined invitation:', invitationId)
  }
}

const handleActivityCreated = (newActivity) => {
  activities.value.unshift(newActivity)
  showCreateActivity.value = false
  currentFilter.value = 'myActivities'
}

const handleParticipantsInvited = (data) => {
  console.log('Participants invited:', data)
  showInviteModal.value = false
}

// Mettre à jour les compteurs des filtres
watchEffect(() => {
  quickFilters[0].count = upcomingActivities.value.length
  quickFilters[1].count = myActivities.value.length
  quickFilters[2].count = pendingInvitations.value.length
  quickFilters[3].count = pastActivities.value.length
})

// SEO
useSeoMeta({
  title: 'Activités - Ressources Relationnelles',
  description: 'Créez et participez à des activités pour favoriser les échanges et renforcer les relations'
})
</script>