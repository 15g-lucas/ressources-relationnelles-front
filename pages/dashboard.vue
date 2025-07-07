<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header mobile -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center space-x-3">
          <img 
            :src="user?.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'" 
            :alt="user?.prenom || 'Utilisateur'"
            class="header-avatar"
            @error="handleUserAvatarError"
            style="border-radius: 50% !important; width: 32px; height: 32px; object-fit: cover;"
          />
          <h1 class="text-lg font-semibold text-gray-900">Accueil</h1>
        </div>
        <button 
          @click="showMenu = !showMenu"
          class="p-2 rounded-md hover:bg-gray-100"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      <!-- Menu dropdown -->
      <div v-if="showMenu" class="absolute top-full right-0 w-48 bg-white shadow-lg rounded-lg mr-4 mt-1 py-2 z-50">
            <NuxtLink
              to="/profile"
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          @click="showMenu = false"
            >
              Mon profil
            </NuxtLink>
        <NuxtLink 
          to="/profile-relations" 
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          @click="showMenu = false"
        >
          Mes relations
        </NuxtLink>
        <NuxtLink 
          to="/activities" 
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          @click="showMenu = false"
        >
          Activités & Jeux
        </NuxtLink>
        
        <!-- Menu admin -->
        <div v-if="user?.role === 'admin'" class="border-t border-gray-200 mt-2 pt-2">
          <NuxtLink 
            to="/admin" 
            class="block px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 font-medium"
            @click="showMenu = false"
          >
            🛡️ Administration
          </NuxtLink>
        </div>
        
        <div class="border-t border-gray-200 mt-2 pt-2">
            <button
              @click="handleLogout"
            class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Déconnexion
            </button>
        </div>
      </div>
    </header>

    <!-- Fil d'actualités -->
    <main class="pb-20">
      <div class="max-w-lg mx-auto px-4 py-6">
        <!-- Barre de recherche et filtres -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Fil d'actualités</h2>
            <button 
              @click="showFilters = !showFilters"
              class="p-2 rounded-md hover:bg-gray-100 bg-white shadow-sm"
            >
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                  </svg>
            </button>
              </div>
          
          <!-- Barre de recherche -->
          <div class="relative mb-4">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher dans les posts..."
              class="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm shadow-sm"
            />
        </div>

          <!-- Filtres (collapsible) -->
          <div v-if="showFilters" class="bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm">
            <div class="space-y-4">
              <!-- Tri -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Trier par</label>
                <select 
                  v-model="sortBy"
                  class="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="date_desc">Plus récent</option>
                  <option value="date_asc">Plus ancien</option>
                  <option value="popularity_desc">Plus populaire</option>
                  <option value="popularity_asc">Moins populaire</option>
                  <option value="comments_desc">Plus commenté</option>
                </select>
              </div>

              <!-- Filtres rapides -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Filtres rapides</label>
                <div class="flex flex-wrap gap-2">
                  <button
                    @click="toggleQuickFilter('saved')"
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                      activeQuickFilters.includes('saved')
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    ]"
                  >
                    ⭐ Sauvegardés ({{ savedPostsCount }})
                  </button>
                  <button
                    @click="toggleQuickFilter('exploited')"
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                      activeQuickFilters.includes('exploited')
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    ]"
                  >
                    ✅ Exploités ({{ exploitedPostsCount }})
                  </button>
                  <button
                    @click="toggleQuickFilter('liked')"
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                      activeQuickFilters.includes('liked')
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    ]"
                  >
                    ❤️ Aimés ({{ likedPostsCount }})
                  </button>
                  <button
                    @click="toggleQuickFilter('myPosts')"
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                      activeQuickFilters.includes('myPosts')
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    ]"
                  >
                    👤 Mes posts ({{ myPostsCount }})
                  </button>
                </div>
              </div>

              <!-- Filtres par hashtags populaires -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Hashtags populaires</label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="hashtag in popularHashtags"
                    :key="hashtag.tag"
                    @click="toggleHashtagFilter(hashtag.tag)"
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                      activeHashtags.includes(hashtag.tag)
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    ]"
                  >
                    #{{ hashtag.tag }} ({{ hashtag.count }})
                  </button>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex justify-between items-center pt-2 border-t border-gray-200">
                <button 
                  @click="resetFilters"
                  class="text-sm text-gray-500 hover:text-gray-700"
                >
                  Réinitialiser
                </button>
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-gray-500">{{ filteredPosts.length }} résultat{{ filteredPosts.length > 1 ? 's' : '' }}</span>
                  <button 
                    @click="showFilters = false"
                    class="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600"
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Filtres actifs (chips) -->
          <div v-if="hasActiveFilters" class="mb-4">
            <div class="flex flex-wrap gap-2">
              <div
                v-if="searchQuery"
                class="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
              >
                <span>Recherche: "{{ searchQuery }}"</span>
                <button 
                  @click="searchQuery = ''"
                  class="ml-1 hover:text-blue-600"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div
                v-for="filter in activeQuickFilters"
                :key="filter"
                class="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
              >
                <span>{{ getFilterLabel(filter) }}</span>
                <button 
                  @click="removeQuickFilter(filter)"
                  class="ml-1 hover:text-green-600"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div
                v-for="hashtag in activeHashtags"
                :key="hashtag"
                class="flex items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs"
              >
                <span>#{{ hashtag }}</span>
                <button 
                  @click="removeHashtagFilter(hashtag)"
                  class="ml-1 hover:text-purple-600"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-6">
          
          <!-- Nouvelle publication -->
          <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div class="flex items-start space-x-3">
              <img 
                :src="user?.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'" 
                :alt="user?.prenom || 'Utilisateur'"
                class="user-avatar"
                @error="handleUserAvatarError"
                style="border-radius: 50% !important; width: 40px; height: 40px; object-fit: cover;"
              />
              <div class="flex-1">
                <textarea 
                  v-model="newPostContent"
                  placeholder="Partagez vos pensées..."
                  rows="3"
                  class="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
                <div class="flex justify-between items-center mt-3">
                  <button 
                    @click="addImage"
                    class="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="text-sm">Photo</span>
                  </button>
                  <button 
                    @click="createPost"
                    :disabled="!newPostContent.trim()"
                    class="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Publier
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Posts -->
        <div class="space-y-4">
          <PostCard 
            v-for="post in filteredPosts" 
            :key="post.id"
            :post="post"
            :current-user-id="user?.id"
            @like="handleLike"
            @delete="handleDelete"
            @showComments="handleShowComments"
            @share="handleShare"
            @viewImage="handleViewImage"
            @save="handleSave"
            @exploit="handleExploit"
          />
        </div>

        <!-- État de chargement -->
        <div v-if="isLoading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p class="text-gray-500 mt-2">Chargement...</p>
        </div>

        <!-- Aucun résultat après filtrage -->
        <div v-else-if="filteredPosts.length === 0 && hasActiveFilters" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.137 0-4.146-.832-5.636-2.364M6 20.14C3.26 18.668 1.5 15.98 1.5 13 1.5 7.477 5.977 3 11.5 3s10 4.477 10 10c0 2.98-1.26 5.668-3.5 7.14" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun post trouvé</h3>
          <p class="mt-1 text-sm text-gray-500">Essayez d'ajuster vos filtres ou votre recherche.</p>
          <button 
            @click="resetFilters"
            class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600"
          >
            Réinitialiser les filtres
          </button>
        </div>

        <!-- Aucun post -->
        <div v-else-if="posts.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun post</h3>
          <p class="mt-1 text-sm text-gray-500">Soyez le premier à partager quelque chose!</p>
        </div>
      </div>
    </main>

    <!-- Navigation bottom mobile -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div class="flex justify-around">
        <NuxtLink 
          to="/dashboard" 
          class="flex flex-col items-center py-2 text-blue-500"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span class="text-xs mt-1">Accueil</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/activities" 
          class="flex flex-col items-center py-2 text-gray-500 hover:text-gray-700"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="text-xs mt-1">Activités</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/profile-mobile" 
          class="flex flex-col items-center py-2 text-gray-500 hover:text-gray-700"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
          <span class="text-xs mt-1">Profil</span>
        </NuxtLink>
      </div>
    </nav>

    <!-- Overlay pour fermer le menu -->
    <div 
      v-if="showMenu" 
      @click="showMenu = false"
      class="fixed inset-0 bg-black bg-opacity-25 z-40"
    ></div>
  </div>
</template>

<script setup>
// Middleware d'authentification (à activer quand le middleware fonctionne)
// definePageMeta({
//   middleware: 'auth'
// })

const { user, logout } = useAuth()

// États de l'UI
const showMenu = ref(false)
const showCreatePost = ref(false)
const isLoading = ref(false)
const newPostContent = ref('')

// États des filtres
const showFilters = ref(false)
const searchQuery = ref('')
const sortBy = ref('date_desc')
const activeQuickFilters = ref([])
const activeHashtags = ref([])

// Posts (données d'exemple avec vraies images)
const posts = ref([
  {
    id: 1,
    content: "Belle journée pour développer de nouvelles relations professionnelles ! 🌟 #networking #success",
    created_at: new Date(Date.now() - 30 * 60 * 1000), // Il y a 30 minutes
    is_liked: false,
    likes_count: 24,
    comments_count: 8,
    is_saved: true,
    is_exploited: false,
    user: {
      id: 2,
      prenom: "Marie",
      nom: "Dubois",
      photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
  },
  {
    id: 2,
    content: "J'ai adoré la conférence sur les relations humaines aujourd'hui. Tellement d'apprentissages à partager ! 📚 #formation #development",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000), // Il y a 2 heures
    is_liked: true,
    likes_count: 42,
    comments_count: 12,
    is_saved: false,
    is_exploited: true,
    user: {
      id: 3,
      prenom: "Pierre",
      nom: "Martin",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    image: "https://images.unsplash.com/photo-1559523275-98fb3c56faf6?w=600&h=400&fit=crop"
  },
  {
    id: 3,
    content: "Nouvelle collaboration en cours ! Hâte de vous présenter notre projet commun. 🤝 #teamwork #innovation",
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000), // Il y a 4 heures
    is_liked: false,
    likes_count: 18,
    comments_count: 6,
    is_saved: true,
    is_exploited: false,
    user: {
      id: 4,
      prenom: "Sophie",
      nom: "Leroy",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop"
  },
  {
    id: 4,
    content: "Moment de détente après une semaine productive. L'équilibre travail-vie personnelle est essentiel ! ⚖️ #wellness #balance",
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000), // Il y a 6 heures
    is_liked: true,
    likes_count: 31,
    comments_count: 9,
    is_saved: false,
    is_exploited: false,
    user: {
      id: 5,
      prenom: "Thomas",
      nom: "Rousseau",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
  },
  {
    id: 5,
    content: "Inspirée par cette citation de Maya Angelou : 'Les gens oublieront ce que vous avez dit, mais ils n'oublieront jamais ce que vous leur avez fait ressentir.' 💭 #inspiration #quotes",
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000), // Il y a 8 heures
    is_liked: false,
    likes_count: 67,
    comments_count: 15,
    is_saved: true,
    is_exploited: true,
    user: {
      id: 6,
      prenom: "Camille",
      nom: "Moreau",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
    }
  },
  {
    id: 6,
    content: "Retour de notre séminaire d'équipe ! Des moments forts de partage et de créativité. 🎯 #team #seminar",
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000), // Il y a 12 heures
    is_liked: true,
    likes_count: 53,
    comments_count: 11,
    is_saved: false,
    is_exploited: false,
    user: {
      id: 7,
      prenom: "Antoine",
      nom: "Lefebvre",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&h=400&fit=crop"
  },
  {
    id: 7,
    content: "Découverte d'un nouveau café coworking dans le quartier. Parfait pour les réunions informelles ! ☕ #coworking #networking",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Il y a 1 jour
    is_liked: false,
    likes_count: 28,
    comments_count: 7,
    is_saved: false,
    is_exploited: false,
    user: {
      id: 8,
      prenom: "Léa",
      nom: "Bernard",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    },
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop"
  }
])

// Computed pour les filtres
const filteredPosts = computed(() => {
  let filtered = [...posts.value]

  // Recherche textuelle
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(post => 
      post.content.toLowerCase().includes(query) ||
      post.user.prenom.toLowerCase().includes(query) ||
      post.user.nom.toLowerCase().includes(query)
    )
  }

  // Filtres rapides
  if (activeQuickFilters.value.includes('saved')) {
    filtered = filtered.filter(post => post.is_saved)
  }
  if (activeQuickFilters.value.includes('exploited')) {
    filtered = filtered.filter(post => post.is_exploited)
  }
  if (activeQuickFilters.value.includes('liked')) {
    filtered = filtered.filter(post => post.is_liked)
  }
  if (activeQuickFilters.value.includes('myPosts')) {
    filtered = filtered.filter(post => post.user.id === user.value?.id)
  }

  // Filtres par hashtags
  if (activeHashtags.value.length > 0) {
    filtered = filtered.filter(post => 
      activeHashtags.value.some(hashtag => 
        post.content.toLowerCase().includes(`#${hashtag.toLowerCase()}`)
      )
    )
  }

  // Tri
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'date_desc':
        return new Date(b.created_at) - new Date(a.created_at)
      case 'date_asc':
        return new Date(a.created_at) - new Date(b.created_at)
      case 'popularity_desc':
        return b.likes_count - a.likes_count
      case 'popularity_asc':
        return a.likes_count - b.likes_count
      case 'comments_desc':
        return b.comments_count - a.comments_count
      default:
        return 0
    }
  })

  return filtered
})

// Statistiques pour les badges
const savedPostsCount = computed(() => posts.value.filter(p => p.is_saved).length)
const exploitedPostsCount = computed(() => posts.value.filter(p => p.is_exploited).length)
const likedPostsCount = computed(() => posts.value.filter(p => p.is_liked).length)
const myPostsCount = computed(() => posts.value.filter(p => p.user.id === user.value?.id).length)

// Hashtags populaires extraits des posts
const popularHashtags = computed(() => {
  const hashtags = {}
  posts.value.forEach(post => {
    const matches = post.content.match(/#(\w+)/g)
    if (matches) {
      matches.forEach(match => {
        const tag = match.substring(1).toLowerCase()
        hashtags[tag] = (hashtags[tag] || 0) + 1
      })
    }
  })
  
  return Object.entries(hashtags)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10) // Top 10 hashtags
})

// Vérifier s'il y a des filtres actifs
const hasActiveFilters = computed(() => {
  return searchQuery.value.length > 0 ||
         activeQuickFilters.value.length > 0 ||
         activeHashtags.value.length > 0 ||
         sortBy.value !== 'date_desc'
})

// Méthodes pour les filtres
const toggleQuickFilter = (filter) => {
  const index = activeQuickFilters.value.indexOf(filter)
  if (index === -1) {
    activeQuickFilters.value.push(filter)
  } else {
    activeQuickFilters.value.splice(index, 1)
  }
}

const removeQuickFilter = (filter) => {
  const index = activeQuickFilters.value.indexOf(filter)
  if (index !== -1) {
    activeQuickFilters.value.splice(index, 1)
  }
}

const toggleHashtagFilter = (hashtag) => {
  const index = activeHashtags.value.indexOf(hashtag)
  if (index === -1) {
    activeHashtags.value.push(hashtag)
  } else {
    activeHashtags.value.splice(index, 1)
  }
}

const removeHashtagFilter = (hashtag) => {
  const index = activeHashtags.value.indexOf(hashtag)
  if (index !== -1) {
    activeHashtags.value.splice(index, 1)
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  sortBy.value = 'date_desc'
  activeQuickFilters.value = []
  activeHashtags.value = []
  showFilters.value = false
}

const getFilterLabel = (filter) => {
  const labels = {
    saved: 'Sauvegardés',
    exploited: 'Exploités',
    liked: 'Aimés',
    myPosts: 'Mes posts'
  }
  return labels[filter] || filter
}

// Fonction de déconnexion
const handleLogout = async () => {
  await logout()
}

// Gestion des posts
const createPost = async () => {
  if (!newPostContent.value.trim()) return
  
  const newPost = {
    id: Date.now(),
    content: newPostContent.value,
    created_at: new Date(),
    is_liked: false,
    likes_count: 0,
    comments_count: 0,
    is_saved: false,
    is_exploited: false,
    user: {
      id: user.value?.id || 1,
      prenom: user.value?.prenom || 'Vous',
      nom: user.value?.nom || '',
      photo: user.value?.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    }
  }
  
  posts.value.unshift(newPost)
  newPostContent.value = ''
}

const addImage = () => {
  // Ici vous pourriez implémenter l'upload d'image
  alert('Fonctionnalité d\'ajout d\'image à venir')
}

// Gestionnaires d'événements des posts
const handleLike = (data) => {
  console.log('Like toggled:', data)
  const post = posts.value.find(p => p.id === data.postId)
  if (post) {
    post.is_liked = data.isLiked
    post.likes_count += data.isLiked ? 1 : -1
  }
}

const handleDelete = (postId) => {
  console.log('Delete post:', postId)
  posts.value = posts.value.filter(post => post.id !== postId)
}

const handleShowComments = (postId) => {
  console.log('Show comments for post:', postId)
  // Naviguer vers la page des commentaires
  navigateTo(`/post/${postId}/comments`)
}

const handleShare = (postId) => {
  console.log('Share post:', postId)
  // Implémenter le partage
  if (navigator.share) {
    navigator.share({
      title: 'Partager ce post',
      text: 'Regardez ce post interessant',
      url: `${window.location.origin}/post/${postId}`
    })
  } else {
    // Fallback pour les navigateurs sans support natif
    const url = `${window.location.origin}/post/${postId}`
    navigator.clipboard.writeText(url)
    alert('Lien copié dans le presse-papier')
  }
}

const handleViewImage = (imageUrl) => {
  console.log('View image:', imageUrl)
  // Ouvrir l'image en plein écran
  window.open(imageUrl, '_blank')
}

const handleSave = (data) => {
  console.log('Save toggled:', data)
  // Trouver le post et mettre à jour ses données
  const post = posts.value.find(p => p.id === data.postId)
  if (post) {
    post.is_saved = data.isSaved
    // Afficher un message de confirmation
    if (data.isSaved) {
      console.log('Post enregistré avec succès!')
      // Ici vous pourriez utiliser une notification toast
    } else {
      console.log('Post retiré des enregistrements')
    }
  }
}

const handleExploit = (data) => {
  console.log('Exploit toggled:', data)
  // Trouver le post et mettre à jour ses données
  const post = posts.value.find(p => p.id === data.postId)
  if (post) {
    post.is_exploited = data.isExploited
    // Afficher un message de confirmation
    if (data.isExploited) {
      console.log('Post marqué comme exploité!')
      // Ici vous pourriez ajouter une logique métier spécifique
    } else {
      console.log('Post marqué comme non exploité')
    }
  }
}

// Gestion des erreurs d'images
const handleUserAvatarError = (event) => {
  // Fallback pour l'avatar utilisateur
  const fallbackAvatars = [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  ]
  const randomAvatar = fallbackAvatars[Math.floor(Math.random() * fallbackAvatars.length)]
  event.target.src = randomAvatar
}

// Charger les posts depuis l'API (optionnel)
const loadPosts = async () => {
  try {
    isLoading.value = true
    const API_BASE_URL = 'https://ressources-relationnelles-api-develop-xvsj0x.laravel.cloud/api'
    const token = useCookie('auth-token')
    
    if (token.value) {
      // Exemple d'appel API pour récupérer les posts
      // const response = await $fetch(`${API_BASE_URL}/posts`, {
      //   headers: {
      //     'Authorization': `Bearer ${token.value}`,
      //     'Accept': 'application/json'
      //   }
      // })
      // posts.value = response.posts
    }
  } catch (error) {
    console.error('Erreur lors du chargement des posts:', error)
  } finally {
    isLoading.value = false
  }
}

// Watchers pour améliorer l'UX
watch([searchQuery, activeQuickFilters, activeHashtags, sortBy], () => {
  // Fermer les filtres après application pour mobile
  if (window.innerWidth < 768) {
    setTimeout(() => {
      showFilters.value = false
    }, 1000)
  }
}, { deep: true })

// Fermer le menu et les filtres quand on clique ailleurs
const closeMenus = () => {
  showMenu.value = false
  if (window.innerWidth < 768) {
    showFilters.value = false
  }
}

// Charger les données au montage du composant
onMounted(() => {
  loadPosts()
  // Ajouter l'event listener pour fermer les menus
  document.addEventListener('click', closeMenus)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenus)
})

// SEO
useSeoMeta({
  title: 'Accueil - Ressources Relationnelles',
  description: 'Fil d\'actualités et interactions sociales'
})
</script>