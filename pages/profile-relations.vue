<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Mobile-like -->
    <header class="bg-white shadow-sm border-b sticky top-0 z-10">
      <div class="max-w-md mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <button @click="goBack" class="p-2 -ml-2">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 class="text-lg font-semibold text-gray-900">Profile</h1>
          <button @click="showMenu = !showMenu" class="p-2 -mr-2">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <div class="max-w-md mx-auto bg-white min-h-screen">
      <!-- Photo de profil et infos principales -->
      <div class="px-6 py-6 text-center border-b">
        <div class="relative inline-block">
          <img 
            :src="user?.photo || '/api/placeholder/120/120'" 
            :alt="user?.prenom + ' ' + user?.nom"
            class="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <button 
            @click="openPhotoModal"
            class="absolute bottom-0 right-0 bg-gray-600 text-white rounded-full p-1.5 shadow-lg"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
        
        <h2 class="mt-3 text-xl font-semibold text-gray-900">
          {{ user?.prenom }} {{ user?.nom }}
        </h2>
        
        <button 
          @click="editProfile = true"
          class="mt-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-2 rounded-full text-sm font-medium transition-colors"
        >
          ✏️ Modifier le profil
        </button>
      </div>

      <!-- Navigation Onglets -->
      <div class="border-b">
        <nav class="flex">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'flex-1 py-3 px-1 text-center text-sm font-medium border-b-2 transition-colors',
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            ]"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Contenu des onglets -->
      <div class="p-4">
        <!-- Onglet Relations -->
        <div v-if="activeTab === 'relations'">
          <!-- Section Famille -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-medium text-gray-900">Famille</h3>
              <button class="text-sm text-gray-500">Voir tous</button>
            </div>
            <div class="grid grid-cols-3 gap-3">
              <div
                v-for="member in familyMembers"
                :key="member.id"
                @click="viewRelationDetails(member)"
                class="text-center cursor-pointer"
              >
                <img 
                  :src="member.photo || '/api/placeholder/60/60'" 
                  :alt="member.prenom"
                  class="w-15 h-15 rounded-full mx-auto object-cover border-2 border-gray-200"
                />
                <p class="mt-1 text-xs text-gray-900 font-medium">{{ member.prenom }}</p>
                <p class="text-xs text-gray-500">{{ member.relation_type }}</p>
              </div>
            </div>
          </div>

          <!-- Section Collègues -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-medium text-gray-900">Collègues</h3>
              <button class="text-sm text-gray-500">Voir tous</button>
            </div>
            <div class="grid grid-cols-3 gap-3">
              <div
                v-for="colleague in colleagues"
                :key="colleague.id"
                @click="viewRelationDetails(colleague)"
                class="text-center cursor-pointer"
              >
                <img 
                  :src="colleague.photo || '/api/placeholder/60/60'" 
                  :alt="colleague.prenom"
                  class="w-15 h-15 rounded-full mx-auto object-cover border-2 border-gray-200"
                />
                <p class="mt-1 text-xs text-gray-900 font-medium">{{ colleague.prenom }}</p>
                <p class="text-xs text-gray-500">{{ colleague.relation_type }}</p>
              </div>
            </div>
          </div>

          <!-- Section Amis -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-medium text-gray-900">Ami(e)s</h3>
              <button class="text-sm text-gray-500">Voir tous</button>
            </div>
            <div class="grid grid-cols-3 gap-3">
              <div
                v-for="friend in friends"
                :key="friend.id"
                @click="viewRelationDetails(friend)"
                class="text-center cursor-pointer"
              >
                <img 
                  :src="friend.photo || '/api/placeholder/60/60'" 
                  :alt="friend.prenom"
                  class="w-15 h-15 rounded-full mx-auto object-cover border-2 border-gray-200"
                />
                <p class="mt-1 text-xs text-gray-900 font-medium">{{ friend.prenom }}</p>
                <p class="text-xs text-gray-500">{{ friend.relation_type }}</p>
              </div>
            </div>
          </div>

          <!-- Bouton Ajouter une relation -->
          <button 
            @click="showAddRelation = true"
            class="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium"
          >
            + Ajouter une relation
          </button>
        </div>

        <!-- Onglet Posts -->
        <div v-if="activeTab === 'posts'">
          <div class="space-y-4">
            <div
              v-for="post in userPosts"
              :key="post.id"
              class="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div class="flex items-start space-x-3">
                <img 
                  :src="user?.photo || '/api/placeholder/40/40'" 
                  :alt="user?.prenom"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900">{{ user?.prenom }} {{ user?.nom }}</h4>
                  <p class="text-sm text-gray-500">{{ formatDate(post.created_at) }}</p>
                  <p class="mt-2 text-gray-800">{{ post.content }}</p>
                  
                  <img 
                    v-if="post.image"
                    :src="post.image" 
                    alt="Post image"
                    class="mt-3 w-full rounded-lg object-cover"
                  />
                  
                  <div class="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                    <button class="flex items-center space-x-1 hover:text-red-500">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{{ post.likes || 0 }}</span>
                    </button>
                    <button class="flex items-center space-x-1 hover:text-blue-500">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>{{ post.comments || 0 }}</span>
                    </button>
                    <button class="flex items-center space-x-1 hover:text-green-500">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      <span>Partager</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Détails Relation -->
    <div v-if="selectedRelation" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg max-w-sm w-full max-h-96 overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">{{ selectedRelation.relation_category }}</h3>
            <button @click="selectedRelation = null" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="space-y-3">
            <div
              v-for="person in getRelationsByCategory(selectedRelation.relation_category)"
              :key="person.id"
              class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg"
            >
              <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <span class="text-indigo-600 font-medium text-sm">{{ person.prenom.charAt(0) }}</span>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ person.prenom }} {{ person.nom }}</p>
                <p class="text-sm text-gray-500">{{ person.relation_type }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Ajouter Relation -->
    <div v-if="showAddRelation" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg max-w-sm w-full">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Ajouter une relation</h3>
            <button @click="showAddRelation = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="addRelation" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                v-model="newRelation.nom"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Nom de la personne"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input
                v-model="newRelation.prenom"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Prénom de la personne"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type de relation</label>
              <select
                v-model="newRelation.relation_type"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Sélectionner...</option>
                <option value="conjoint">Conjoint(e)</option>
                <option value="enfant">Enfant</option>
                <option value="parent">Parent</option>
                <option value="frere_soeur">Frère/Sœur</option>
                <option value="collegue">Collègue</option>
                <option value="ami">Ami(e)</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            
            <div class="flex space-x-3 pt-4">
              <button
                type="button"
                @click="showAddRelation = false"
                class="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                class="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Ajouter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Navigation Bottom -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t max-w-md mx-auto">
      <div class="flex justify-around py-2">
        <NuxtLink to="/dashboard" class="p-3">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </NuxtLink>
        <button class="p-3">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <button class="p-3">
          <svg class="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const { user, logout } = useAuth()

// État des onglets et données
const activeTab = ref('relations')
const selectedRelation = ref(null)
const showAddRelation = ref(false)
const showMenu = ref(false)
const editProfile = ref(false)

const tabs = [
  { id: 'relations', label: 'Relations' },
  { id: 'posts', label: 'Posts' }
]

// Formulaire nouvelle relation
const newRelation = reactive({
  nom: '',
  prenom: '',
  relation_type: ''
})

// Données des relations (simulées, à remplacer par API)
const familyMembers = reactive([
  { id: 1, prenom: 'Jojo', nom: 'Saucisse', relation_type: 'conjoint', relation_category: 'Famille', photo: null },
  { id: 2, prenom: 'Jean', nom: 'Bernard', relation_type: 'enfant', relation_category: 'Famille', photo: null },
  { id: 3, prenom: 'Michel', nom: 'Too', relation_type: 'parent', relation_category: 'Famille', photo: null }
])

const colleagues = reactive([
  { id: 4, prenom: 'Foo', nom: 'Bar', relation_type: 'collegue', relation_category: 'Collègues', photo: null },
  { id: 5, prenom: 'Jean Luc', nom: 'Michel', relation_type: 'manager', relation_category: 'Collègues', photo: null },
  { id: 6, prenom: 'Maeva', nom: 'Bernard', relation_type: 'collegue', relation_category: 'Collègues', photo: null }
])

const friends = reactive([
  { id: 7, prenom: 'Jean Michel', nom: 'Aulas', relation_type: 'ami', relation_category: 'Ami(e)s', photo: null },
  { id: 8, prenom: 'Bernard', nom: 'Tapis', relation_type: 'ami', relation_category: 'Ami(e)s', photo: null },
  { id: 9, prenom: 'Didier', nom: 'Drogba', relation_type: 'ami', relation_category: 'Ami(e)s', photo: null }
])

// Posts utilisateur (simulés)
const userPosts = reactive([
  {
    id: 1,
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin suscipit nunc et dui interdum, ut laoreet magna vehiculat. Sed tristique.",
    image: "/api/placeholder/300/200",
    likes: 12,
    comments: 3,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000)
  }
])

// Fonctions
const goBack = () => {
  navigateTo('/dashboard')
}

const viewRelationDetails = (relation) => {
  selectedRelation.value = relation
}

const getRelationsByCategory = (category) => {
  const allRelations = [...familyMembers, ...colleagues, ...friends]
  return allRelations.filter(r => r.relation_category === category)
}

const addRelation = async () => {
  try {
    // Ici, appel API pour ajouter la relation
    const newPerson = {
      id: Date.now(),
      ...newRelation,
      relation_category: getRelationCategory(newRelation.relation_type),
      photo: null
    }
    
    // Ajouter à la bonne catégorie
    if (newPerson.relation_category === 'Famille') {
      familyMembers.push(newPerson)
    } else if (newPerson.relation_category === 'Collègues') {
      colleagues.push(newPerson)
    } else {
      friends.push(newPerson)
    }
    
    // Reset form
    Object.assign(newRelation, { nom: '', prenom: '', relation_type: '' })
    showAddRelation.value = false
    
  } catch (error) {
    console.error('Erreur ajout relation:', error)
  }
}

const getRelationCategory = (type) => {
  const familyTypes = ['conjoint', 'enfant', 'parent', 'frere_soeur']
  const workTypes = ['collegue', 'manager']
  
  if (familyTypes.includes(type)) return 'Famille'
  if (workTypes.includes(type)) return 'Collègues'
  return 'Ami(e)s'
}

const formatDate = (date) => {
  const now = new Date()
  const diff = now - new Date(date)
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (hours < 24) {
    return `Il y a ${hours}h`
  } else {
    const days = Math.floor(hours / 24)
    return `Il y a ${days}j`
  }
}

const openPhotoModal = () => {
  // Fonction pour changer la photo de profil
  console.log('Ouvrir modal photo')
}

// Charger les relations depuis l'API
const loadRelations = async () => {
  try {
    const API_BASE_URL = 'https://ressources-relationnelles-api-develop-xvsj0x.laravel.cloud/api'
    const token = useCookie('auth-token')
    
    if (token.value) {
      // const response = await $fetch(`${API_BASE_URL}/user/relations`, {
      //   headers: {
      //     'Authorization': `Bearer ${token.value}`,
      //     'Accept': 'application/json'
      //   }
      // })
      // Traiter les données des relations
    }
  } catch (error) {
    console.error('Erreur chargement relations:', error)
  }
}

onMounted(() => {
  loadRelations()
})

// SEO
useSeoMeta({
  title: 'Profil et Relations',
  description: 'Gérez votre profil et vos relations'
})
</script>

<style scoped>
.w-15 {
  width: 3.75rem;
}
.h-15 {
  height: 3.75rem;
}
</style>