<template>
  <div>
    <!-- Section pour afficher les posts récents -->
    <div class="space-y-4">
        <!-- Cartes par défaut -->
        <Postcard
            image="path/to/profile-image.jpg"
            name="Romain MUR"
            pseudo="romainmur"
            text="Bienvenue sur notre plateforme ! Découvrez les derniers posts."
            publishedAt="2025-06-06T12:00:00"
        />

        <!-- Cartes dynamiques -->
        <Postcard
            v-for="post in posts"
            :key="post.id"
            :image="post.image"
            :name="post.name"
            :pseudo="post.pseudo"
            :text="post.text"
            :publishedAt="post.publishedAt"
            :contentImages="post.contentImages"
        />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Postcard from '~/components/Postcard.vue';
import Sidebar from '~/components/Sidebar.vue';

const posts = ref([]);

const fetchPosts = async () => {
  try {
    // Remplacez cette URL par l'endpoint réel de votre API
    const response = await fetch('https://votre-api.com/posts');

    if (!response.ok) {
      throw new Error(`Erreur HTTP! statut: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des posts:', error);
    return []; // Retourne un tableau vide en cas d'erreur
  }
};

onMounted(async () => {
  try {
    // Utilisez fetchPosts pour obtenir les données réelles
    //const data = await fetchPosts();

    // Si vous voulez tester avec des données simulées, vous pouvez décommenter la ligne suivante
    const data = simulatedData;

    posts.value = data;
  } catch (error) {
    console.error('Erreur lors du chargement des posts:', error);
  }
});

// Données simulées pour les tests
const simulatedData = [
  {
    id: 2,
    image: "path/to/profile-image.jpg",
    name: "Catherine Sauce",
    pseudo: "csauce",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    publishedAt: "2024-09-10T14:00:00"
  },
  {
    id: 3,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Flag_of_Mozambique.svg/640px-Flag_of_Mozambique.svg.png",
    name: "Mozambique",
    pseudo: "mozambiquezer",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    contentImages: ["https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Flag_of_Mozambique.svg/640px-Flag_of_Mozambique.svg.png"],
    publishedAt: "2023-10-10T14:00:00"
  },
];
</script>
