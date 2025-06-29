<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1 p-6 overflow-y-auto space-y-4">
      <!-- Affiche la Postcard spéciale uniquement si l'overlay n'est pas affiché -->
      <!-- Post de création -->
      <Postcard
        v-if="route.query.openAdd === '1' && !showOverlay"
        image="path/to/profile-image.jpg"
        name="Toi"
        pseudo="tonpseudo"
        title="Nouveau post à créer ici..."
        description=""
        url=""
        contentImages={[]}
        saves={0}
        favorites={0}
        exploited={0}
        shares={0}
        timestamp="2025-06-28T12:00:00"
        :comments="[]"
      />

      <!-- Post statique d'accueil -->
      <Postcard
        image="path/to/profile-image.jpg"
        name="Romain MUR"
        pseudo="romainmur"
        title="Bienvenue sur notre plateforme !"
        description="Découvrez les derniers posts."
        url=""
        contentImages={[]}
        saves=12
        favorites=34
        exploited=5
        shares=3
        timestamp="2025-06-06T12:00:00"
        :comments="[]"
      />

      <!-- Liste dynamique de posts -->
      <Postcard
        v-for="post in posts"
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

    <!-- Overlay -->
    <AddPostOverlay v-if="showOverlay" @close="closeOverlay" />
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
function addPost(newPostContent) {
  // Construis un nouveau post avec les données reçues
  const newPost = {
    id: Date.now(),
    image: "https://randomuser.me/api/portraits/lego/1.jpg", // ou autre image par défaut
    name: "Ton Nom", // à personnaliser ou récupérer dynamiquement
    pseudo: "ton_pseudo",
    text: newPostContent,
    publishedAt: new Date().toISOString(),
    contentImages: []
  }
  posts.value.unshift(newPost) // Ajoute en tête de liste
  closeOverlay()
}

const simulatedData = [
  {
    id: 2,
    author: {
      image: "path/to/profile-image.jpg",
      name: "Catherine Sauce",
      pseudo: "csauce"
    },
    title: "Lorem ipsum dolor sit amet",
    description: "Consectetur adipiscing elit...",
    url: "",
    visibility: 1,
    created_at: "2024-09-10T14:00:00",
    updated_at: "2024-09-10T14:00:00",
    contentImages: [],
    saves: 4,
    favorites: 2,
    exploited: 1,
    shares: 0,
    comments: []
  },
  {
    id: 3,
    author: {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Flag_of_Mozambique.svg/640px-Flag_of_Mozambique.svg.png",
      name: "Mozambique",
      pseudo: "mozambiquezer"
    },
    title: "Lorem ipsum dolor sit amet",
    description: "Consectetur adipiscing elit...",
    url: "",
    visibility: 1,
    created_at: "2023-10-10T14:00:00",
    updated_at: "2023-10-10T14:00:00",
    contentImages: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Flag_of_Mozambique.svg/640px-Flag_of_Mozambique.svg.png"
    ],
    saves: 7,
    favorites: 3,
    exploited: 2,
    shares: 1,
    comments: []
  }
]
</script>
