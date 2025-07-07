<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Mobile -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="px-4 py-3">
        <div class="flex items-center justify-between">
          <button @click="goBack" class="p-2 -ml-2 touch-target">
            <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 class="text-lg font-semibold text-gray-900">
            {{ currentPageTitle }}
          </h1>
          <div class="relative">
            <button @click="showOptionsMenu = !showOptionsMenu" class="p-2 -mr-2 touch-target">
              <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            
            <!-- Menu d'options -->
            <div v-if="showOptionsMenu" class="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <button 
                @click="editProfile"
                class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3"
              >
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Modifier le profil</span>
              </button>
              
              <div class="border-t border-gray-100 my-1"></div>
              
              <button 
                @click="handleLogout"
                class="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-3"
              >
                <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenu principal -->
    <div class="pb-20"> <!-- Espace pour la navigation bottom -->
      <!-- Vue principale du profil -->
      <div v-if="currentView === 'profile'" class="bg-white">
        <!-- Section Profil -->
        <div class="px-4 py-6 text-center border-b border-gray-100">
          <!-- Photo de profil -->
          <div class="relative inline-block mb-4">
            <div class="w-24 h-24 mx-auto">
              <img 
                :src="userProfileImage" 
                :alt="fullName"
                class="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                loading="lazy"
                @error="handleImageError"
              />
            </div>
            <button 
              @click="openImagePicker"
              class="absolute bottom-0 right-1/2 translate-x-8 bg-gray-700 text-white rounded-full p-2 shadow-lg touch-target"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          
          <!-- Nom -->
          <h2 class="text-xl font-semibold text-gray-900 mb-6">
            {{ fullName }}
          </h2>
          
          <!-- Bouton Modifier le profil -->
          <button 
            @click="editProfile"
            class="bg-yellow-400 text-gray-900 px-8 py-3 rounded-full text-sm font-medium touch-target inline-flex items-center justify-center min-w-40"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Modifier le profil
          </button>
        </div>

        <!-- Navigation Onglets -->
        <div class="border-b border-gray-200 bg-white sticky top-16 z-40">
          <div class="flex">
            <button
              @click="activeTab = 'relations'"
              :class="[
                'flex-1 py-4 text-center text-sm font-medium border-b-2 touch-target',
                activeTab === 'relations'
                  ? 'border-gray-400 text-gray-900 bg-gray-50'
                  : 'border-transparent text-gray-500'
              ]"
            >
              Relations
            </button>
          
              
          </div>
        </div>

        <!-- Contenu des onglets -->
        <div class="min-h-screen">
          <!-- Onglet Relations -->
          <div v-if="activeTab === 'relations'" class="p-4 space-y-6">
            <!-- Section Famille -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-base font-medium text-gray-900">Famille</h3>
                <button 
                  @click="viewRelationCategory('Famille')"
                  class="text-sm text-gray-500 touch-target p-2 -m-2"
                >
                  Voir tous
                </button>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div
                  v-for="member in familyMembers.slice(0, 3)"
                  :key="member.id"
                  @click="viewPersonProfile(member)"
                  class="text-center touch-target p-2 -m-2"
                >
                  <div class="w-20 h-20 mx-auto mb-3">
                    <img 
                      :src="member.photo" 
                      :alt="member.prenom"
                      class="w-full h-full rounded-full object-cover border-2 border-gray-200"
                      loading="lazy"
                      @error="handleImageError"
                    />
                  </div>
                  <p class="text-sm text-gray-900 font-medium leading-tight mb-1">{{ member.prenom }}</p>
                  <p class="text-xs text-gray-500 leading-tight">{{ member.relation_type }}</p>
                </div>
              </div>
            </div>

            <!-- Section Collègues -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-base font-medium text-gray-900">Collègues</h3>
                <button 
                  @click="viewRelationCategory('Collègues')"
                  class="text-sm text-gray-500 touch-target p-2 -m-2"
                >
                  Voir tous
                </button>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div
                  v-for="colleague in colleagues.slice(0, 3)"
                  :key="colleague.id"
                  @click="viewPersonProfile(colleague)"
                  class="text-center touch-target p-2 -m-2"
                >
                  <div class="w-20 h-20 mx-auto mb-3">
                    <img 
                      :src="colleague.photo" 
                      :alt="colleague.prenom"
                      class="w-full h-full rounded-full object-cover border-2 border-gray-200"
                      loading="lazy"
                      @error="handleImageError"
                    />
                  </div>
                  <p class="text-sm text-gray-900 font-medium leading-tight mb-1">{{ colleague.prenom }}</p>
                  <p class="text-xs text-gray-500 leading-tight">{{ colleague.relation_type }}</p>
                </div>
              </div>
            </div>

            <!-- Section Amis -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-base font-medium text-gray-900">Ami(e)s</h3>
                <button 
                  @click="viewRelationCategory('Ami(e)s')"
                  class="text-sm text-gray-500 touch-target p-2 -m-2"
                >
                  Voir tous
                </button>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div
                  v-for="friend in friends.slice(0, 3)"
                  :key="friend.id"
                  @click="viewPersonProfile(friend)"
                  class="text-center touch-target p-2 -m-2"
                >
                  <div class="w-20 h-20 mx-auto mb-3">
                    <img 
                      :src="friend.photo" 
                      :alt="friend.prenom"
                      class="w-full h-full rounded-full object-cover border-2 border-gray-200"
                      loading="lazy"
                      @error="handleImageError"
                    />
                  </div>
                  <p class="text-sm text-gray-900 font-medium leading-tight mb-1">{{ friend.prenom }}</p>
                  <p class="text-xs text-gray-500 leading-tight">{{ friend.relation_type }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Onglet Posts -->
          <div v-if="activeTab === 'posts'" class="p-4">
            <div class="space-y-4">
              <!-- Post de l'utilisateur -->
              <div
                v-for="post in userPosts"
                :key="post.id"
                class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
              >
                <!-- Header du post -->
                <div class="p-4 flex items-start space-x-3">
                  <div class="w-10 h-10 flex-shrink-0">
                    <img 
                      :src="userProfileImage" 
                      :alt="fullName"
                      class="w-full h-full rounded-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <div>
                        <h4 class="font-medium text-gray-900 text-sm">{{ fullName }}</h4>
                        <p class="text-xs text-gray-500">{{ formatDate(post.created_at) }}</p>
                      </div>
                      <button class="text-gray-400 touch-target p-1 -m-1">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                    
                    <!-- Contenu du post -->
                    <div class="mt-3">
                      <p class="text-gray-800 text-sm leading-relaxed">{{ post.content }}</p>
                    </div>
                  </div>
                </div>
                
                <!-- Image du post -->
                <div v-if="post.image" class="px-4 pb-3">
                  <div class="rounded-lg overflow-hidden">
                    <img 
                      :src="post.image" 
                      :alt="`Photo de ${fullName}`"
                      class="w-full object-cover max-h-64"
                      loading="lazy"
                      @error="handleImageError"
                    />
                  </div>
                </div>
                
                <!-- Actions du post -->
                <div class="px-4 pb-4">
                  <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div class="flex items-center space-x-6">
                      <button class="flex items-center text-gray-500 touch-target p-2 -m-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                      
                      <button class="flex items-center text-gray-500 touch-target p-2 -m-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </button>
                      
                      <button class="flex items-center text-gray-500 touch-target p-2 -m-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                    </div>
                    
                    <button class="flex items-center text-gray-500 touch-target p-2 -m-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vue détails de relation -->
      <div v-if="currentView === 'relation-details'" class="bg-white min-h-screen">
        <div class="p-4">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">{{ selectedCategory }}</h3>
            <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          
          <div class="space-y-3">
            <div
              v-for="person in getRelationsByCategory(selectedCategory)"
              :key="person.id"
              class="flex items-center space-x-3 p-3 rounded-lg touch-target -m-1"
            >
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-blue-600 font-semibold text-sm">{{ person.prenom.charAt(0) }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900 truncate">{{ person.prenom }} {{ person.nom }}</p>
                <p class="text-sm text-gray-500 capitalize truncate">{{ person.relation_type }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Bottom fixe -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
      <div class="flex justify-around py-2">
        <NuxtLink to="/dashboard" class="flex flex-col items-center justify-center touch-target p-3">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </NuxtLink>
        <button class="flex flex-col items-center justify-center touch-target p-3">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <button class="flex flex-col items-center justify-center touch-target p-3">
          <svg class="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Overlay pour fermer le menu d'options -->
    <div 
      v-if="showOptionsMenu" 
      @click="showOptionsMenu = false"
      class="fixed inset-0 bg-transparent z-40"
    ></div>

    <!-- Modal de changement de photo -->
    <div v-if="showImagePicker" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div class="bg-white rounded-t-lg w-full max-w-md mx-auto safe-area-bottom">
        <div class="p-6">
          <div class="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
          <h3 class="text-lg font-semibold mb-6 text-center">Changer la photo de profil</h3>
          <div class="space-y-4">
            <button 
              @click="selectFromGallery"
              class="w-full text-left p-4 rounded-lg touch-target flex items-center space-x-3"
            >
              <span class="text-2xl">📸</span>
              <span class="text-base">Choisir depuis la galerie</span>
            </button>
            <button 
              @click="takePhoto"
              class="w-full text-left p-4 rounded-lg touch-target flex items-center space-x-3"
            >
              <span class="text-2xl">📷</span>
              <span class="text-base">Prendre une photo</span>
            </button>
            <button 
              @click="removePhoto"
              class="w-full text-left p-4 rounded-lg touch-target flex items-center space-x-3 text-red-600"
            >
              <span class="text-2xl">🗑️</span>
              <span class="text-base">Supprimer la photo</span>
            </button>
          </div>
          <div class="mt-6 pt-4 border-t">
            <button 
              @click="showImagePicker = false"
              class="w-full py-3 text-gray-600 text-center touch-target"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { user, logout } = useAuth()

// État de la vue
const currentView = ref('profile') // 'profile' | 'relation-details'
const activeTab = ref('relations')
const selectedCategory = ref('')
const showImagePicker = ref(false)
const showOptionsMenu = ref(false)

// Computed
const fullName = computed(() => {
  return user.value ? `${user.value.prenom} ${user.value.nom}` : 'thomas'
})

const userProfileImage = computed(() => {
  // Photo de profil par défaut depuis Unsplash
  return user.value?.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
})

const currentPageTitle = computed(() => {
  if (currentView.value === 'relation-details') {
    return 'Profile'
  }
  return 'Profile'
})

// Données des relations avec photos Unsplash (non-copyright)
const familyMembers = reactive([
  { id: 1, prenom: 'Jojo', nom: 'Saucisse', relation_type: 'conjoint', category: 'Famille', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
  { id: 2, prenom: 'Jean', nom: 'Bernard', relation_type: 'enfant', category: 'Famille', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
  { id: 3, prenom: 'Michel', nom: 'Too', relation_type: 'parent', category: 'Famille', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' },
  { id: 4, prenom: 'Sophia', nom: 'Martin', relation_type: 'sœur', category: 'Famille', photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face' },
  { id: 5, prenom: 'Lucas', nom: 'Dupont', relation_type: 'frère', category: 'Famille', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face' }
])

const colleagues = reactive([
  { id: 6, prenom: 'Maeva', nom: 'Bernard', relation_type: 'collègue', category: 'Collègues', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face' },
  { id: 7, prenom: 'Thomas', nom: 'Aulas', relation_type: 'manager', category: 'Collègues', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face' },
  { id: 8, prenom: 'Sarah', nom: 'Cohen', relation_type: 'collègue', category: 'Collègues', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face' }
])

const friends = reactive([
  { id: 9, prenom: 'Emma', nom: 'Wilson', relation_type: 'ami', category: 'Ami(e)s', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face' },
  { id: 10, prenom: 'Alex', nom: 'Johnson', relation_type: 'ami', category: 'Ami(e)s', photo: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face' },
  { id: 11, prenom: 'Maya', nom: 'Patel', relation_type: 'ami', category: 'Ami(e)s', photo: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=150&h=150&fit=crop&crop=face' }
])

// Posts utilisateur avec images Unsplash
const userPosts = reactive([
  {
    id: 1,
    content: "Belle journée au bureau aujourd'hui ! L'équipe était vraiment motivée et nous avons fait de super avancées sur le projet. Hâte de voir les résultats ! 💪",
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop',
    likes: 12,
    comments: 3,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 2,
    content: "Weekend en famille ! Rien de mieux qu'un bon barbecue dans le jardin avec tous ceux qu'on aime ❤️ Ces moments sont précieux.",
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=300&fit=crop',
    likes: 24,
    comments: 8,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: 3,
    content: "Nouvelle recette testée ce soir ! Un délicieux risotto aux champignons. La cuisine c'est ma passion 👨‍🍳",
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    likes: 18,
    comments: 5,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  }
])

// Fonctions
const goBack = () => {
  if (currentView.value === 'relation-details') {
    currentView.value = 'profile'
    selectedCategory.value = ''
  } else {
    navigateTo('/dashboard')
  }
}

const editProfile = () => {
  showOptionsMenu.value = false
  navigateTo('/profile')
}

const handleLogout = async () => {
  showOptionsMenu.value = false
  await logout()
}

const openImagePicker = () => {
  showImagePicker.value = true
}

const selectFromGallery = () => {
  console.log('Sélectionner depuis la galerie')
  showImagePicker.value = false
}

const takePhoto = () => {
  console.log('Prendre une photo')
  showImagePicker.value = false
}

const removePhoto = () => {
  console.log('Supprimer la photo')
  showImagePicker.value = false
}

const viewRelationCategory = (category) => {
  selectedCategory.value = category
  currentView.value = 'relation-details'
}

const viewPersonProfile = (person) => {
  console.log('Voir profil de:', person.prenom)
}

const getRelationsByCategory = (category) => {
  const allRelations = [...familyMembers, ...colleagues, ...friends]
  return allRelations.filter(r => r.category === category)
}

const formatDate = (date) => {
  const now = new Date()
  const postDate = new Date(date)
  const diff = now - postDate
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return 'À l\'instant'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}j`
  
  return postDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  })
}

// Charger les données depuis l'API
const loadUserData = async () => {
  try {
    // TODO: Charger les vraies données depuis l'API
  } catch (error) {
    console.error('Erreur chargement données:', error)
  }
}

// Fonction pour gérer les erreurs d'images
const handleImageError = (event) => {
  // Image de fallback en cas d'erreur
  event.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
}

onMounted(() => {
  loadUserData()
})

// SEO
useSeoMeta({
  title: 'Mon Profil',
  description: 'Profil utilisateur avec relations et posts'
})
</script>

<style scoped>
/* Classes utilitaires Mobile First */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

/* Scroll smooth pour mobile */
html {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

/* Optimisations tactiles */
button, a {
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

/* Amélioration de la zone de touche pour les petits éléments */
.touch-target {
  position: relative;
}

.touch-target::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 44px;
  min-height: 44px;
  z-index: -1;
}

/* Responsive Design - Desktop */
@media (min-width: 768px) {
  .max-w-md {
    max-width: 400px;
  }
  
  .touch-target {
    min-height: auto;
    min-width: auto;
  }
  
  .touch-target::before {
    display: none;
  }
}

/* Animation pour les transitions de vue */
.view-transition {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

/* Styles pour le modal photo en mode mobile */
@media (max-width: 640px) {
  .modal-mobile {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    transform: translateY(100%);
    transition: transform 0.3s ease-out;
  }
  
  .modal-mobile.show {
    transform: translateY(0);
  }
}

/* Optimisation pour les écrans très petits */
@media (max-width: 320px) {
  .grid-cols-3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  .text-xl {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
}

/* Amélioration du scroll sur mobile */
.scroll-smooth {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

/* Focus states pour l'accessibilité */
.touch-target:focus {
  outline: 2px solid #4F46E5;
  outline-offset: 2px;
}

/* États de chargement pour les images */
.loading-image {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Amélioration du contraste pour l'accessibilité */
@media (prefers-contrast: high) {
  .text-gray-500 {
    color: #374151;
  }
  
  .border-gray-200 {
    border-color: #6B7280;
  }
}

/* Mode sombre (si nécessaire) */
@media (prefers-color-scheme: dark) {
  .bg-white {
    background-color: #1F2937;
  }
  
  .text-gray-900 {
    color: #F9FAFB;
  }
  
  .text-gray-500 {
    color: #9CA3AF;
  }
  
  .border-gray-200 {
    border-color: #374151;
  }
}

/* Animation d'entrée pour les éléments */
.fade-in {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Optimisation pour les interactions tactiles */
.tap-highlight-none {
  -webkit-tap-highlight-color: transparent;
}

/* Styles pour les états de chargement */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 0.375rem;
}

/* Amélioration de la lisibilité sur petits écrans */
@media (max-width: 375px) {
  .text-sm {
    font-size: 0.75rem;
    line-height: 1rem;
  }
  
  .text-xs {
    font-size: 0.625rem;
    line-height: 0.875rem;
  }
  
  .p-4 {
    padding: 0.75rem;
  }
  
  .px-4 {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
  
  .py-4 {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }
}

/* Gestion des images cassées */
img {
  background-color: #F3F4F6;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'/%3E%3C/svg%3E");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 30%;
}

/* Performance - Optimisation du rendu */
.will-change-transform {
  will-change: transform;
}

.contain-layout {
  contain: layout;
}

/* Amélioration des transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* États hover pour desktop uniquement */
@media (hover: hover) {
  .hover\:bg-gray-50:hover {
    background-color: #F9FAFB;
  }
  
  .hover\:text-gray-700:hover {
    color: #374151;
  }
  
  .hover\:bg-yellow-500:hover {
    background-color: #F59E0B;
  }
}

/* Indicateurs de chargement */
.loading-spinner {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Amélioration de l'affichage des erreurs */
.error-state {
  background-color: #FEF2F2;
  border: 1px solid #FECACA;
  color: #B91C1C;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

/* États vides */
.empty-state {
  text-align: center;
  padding: 2rem 1rem;
  color: #6B7280;
}

.empty-state svg {
  width: 3rem;
  height: 3rem;
  margin: 0 auto 1rem;
  opacity: 0.5;
}
</style>