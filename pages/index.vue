<template>
  <div class="flex relative">
    <Sidebar />

    <div class="flex-1 p-6 overflow-y-auto space-y-4">
      <!-- Bouton filtre en haut à droite, en superposition -->
    <div class="fixed top-4 right-6 z-50">
        <select
          v-model="selectedFilter"
          class="px-4 py-2 rounded-lg bg-white text-gray-700 text-sm shadow-md border border-gray-300"
        >
          <option value="all">Tous</option>
          <option value="1">Famille</option>
          <option value="2">Amis</option>
          <option value="3">Collègues</option>
        </select>
      </div>

      <!-- Liste des Postcards -->
      <div class="space-y-4">
        <!-- Post de création -->
        <Postcard
          v-if="route.query.openAdd === '1' && !showOverlay"
          image="path/to/profile-image.jpg"
          name="Toi"
          pseudo="tonpseudo"
          title="Nouveau post à créer ici..."
          description=""
          url=""
          :contentImages="[]"
          :saves="0"
          :favorites="0"
          :exploited="0"
          :shares="0"
          timestamp="2025-06-28T12:00:00"
          :comments="[]"
        />

        <!-- Post statique de bienvenue -->
        <!--<Postcard
          image="path/to/profile-image.jpg"
          name="Romain MUR"
          pseudo="romainmur"
          title="Bienvenue sur notre plateforme !"
          description="Découvrez les derniers posts."
          url=""
          :contentImages="[]"
          :saves="12"
          :favorites="34"
          :exploited="5"
          :shares="3"
          timestamp="2025-06-06T12:00:00"
          :comments="[]"
        />-->

        <!-- Postcards filtrées -->
        <Postcard
          v-for="post in filteredPosts"
          :key="post.id"
          :image="post.author.image"
          :name="post.author.name"
          :pseudo="post.author.pseudo"
          :title="post.title"
          :description="post.description"
          :url="post.url"
          :contentImages="post.contentImages"
          :saves="post.saves"
          :favorites="post.favorites"
          :exploited="post.exploited"
          :shares="post.shares"
          :timestamp="post.created_at"
          :comments="post.comments"
        />
      </div>
    </div>

    <!-- Overlay de création -->
    <AddPostOverlay
      v-if="showOverlay"
      @close="closeOverlay"
      @submit-post="addPost"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Postcard from '~/components/Postcard.vue'
import Sidebar from '~/components/Sidebar.vue'
import AddPostOverlay from '~/components/AddPostOverlay.vue'

const route = useRoute()
const router = useRouter()
const posts = ref([])

const showOverlay = computed(() => route.query.openAdd === '1')

function closeOverlay() {
  const newQuery = { ...route.query }
  delete newQuery.openAdd
  router.replace({ query: newQuery })
}

function onOpenAddPost() {
  router.replace({ query: { ...route.query, openAdd: '1' } })
}

onMounted(() => {
  window.addEventListener('open-add-post', onOpenAddPost)
})

onBeforeUnmount(() => {
  window.removeEventListener('open-add-post', onOpenAddPost)
})

const fetchPosts = async () => {
  try {
    const response = await fetch('https://votre-api.com/posts')
    if (!response.ok) throw new Error(`Erreur HTTP! statut: ${response.status}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erreur lors de la récupération des posts:', error)
    return []
  }
}

onMounted(async () => {
  try {
    // const data = await fetchPosts()
    const data = simulatedData
    posts.value = data
  } catch (error) {
    console.error('Erreur lors du chargement des posts:', error)
  }
})

// Méthode pour ajouter un post (depuis l'overlay)
function addPost(postData) {
  const newPost = {
    id: Date.now(),
    author: {
      image: "https://randomuser.me/api/portraits/lego/1.jpg",
      name: "Vous", 
      pseudo: "you"
    },
    title: postData.title || '',
    description: postData.content,
    url: "",
    visibility: postData.visibility,
    visibilityOptions: postData.visibilityOptions || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    contentImages: [],
    saves: 0,
    favorites: 0,
    exploited: 0,
    shares: 0,
    comments: []
  }

  posts.value.unshift(newPost)
  closeOverlay()
}

const simulatedData = [
  {
    id: 4,
    author: {
      image: "https://www.w3schools.com/howto/img_avatar.png",
      name: "Jean Dupont",
      pseudo: "jeandupont"
    },
    title: "Comprendre les bases de JavaScript",
    description: "JavaScript est un langage de programmation polyvalent utilisé pour rendre les pages web interactives.",
    url: "",
    visibility: 1,
    created_at: "2024-08-01T09:30:00",
    updated_at: "2024-08-01T09:30:00",
    contentImages: [
      "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
    ],
    saves: 10,
    favorites: 5,
    exploited: 3,
    shares: 2,
    comments: [
    ]
  },
  {
    id: 5,
    author: {
      image: "https://www.w3schools.com/howto/img_avatar2.png",
      name: "Marie Martin",
      pseudo: "mariemartin"
    },
    title: "L'art de la photographie",
    description: "La photographie est bien plus que capturer des moments, c'est raconter des histoires à travers des images.",
    url: "",
    visibility: 3,
    created_at: "2024-07-15T11:45:00",
    updated_at: "2024-07-15T11:45:00",
    contentImages: [
      "https://static.vecteezy.com/system/resources/previews/002/556/694/non_2x/eiffel-tower-is-the-tallest-structure-in-paris-france-photo.jpg"
    ],
    saves: 15,
    favorites: 8,
    exploited: 4,
    shares: 3,
    comments: []
  },
  {
    id: 6,
    author: {
      image: "https://www.w3schools.com/w3images/avatar6.png",
      name: "Alice Lefèvre",
      pseudo: "alicelefevre"
    },
    title: "Cuisiner des repas délicieux à la maison",
    description: "Découvrez comment cuisiner des repas délicieux avec des ingrédients simples et accessibles.",
    url: "",
    visibility: 2,
    created_at: "2024-06-20T16:20:00",
    updated_at: "2024-06-20T16:20:00",
    contentImages: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1200px-Good_Food_Display_-_NCI_Visuals_Online.jpg"
    ],
    saves: 20,
    favorites: 12,
    exploited: 6,
    shares: 5,
    comments: []
  }
];

const selectedFilter = ref('all')

const filteredPosts = computed(() => {
  if (selectedFilter.value === 'all') {
    return posts.value
  }
  return posts.value.filter(post => String(post.visibility) === selectedFilter.value)
})

</script>
