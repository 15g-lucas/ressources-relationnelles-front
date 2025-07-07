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
          <h1 class="text-lg font-semibold text-gray-900">Commentaires</h1>
        </div>
        <div class="text-sm text-gray-500">
          {{ comments.length }} commentaire{{ comments.length > 1 ? 's' : '' }}
        </div>
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="pb-24">
      <div class="comments-container">
        <!-- Post original -->
        <div v-if="post" class="original-post">
          <div class="p-4">
            <div class="flex items-start space-x-3">
              <img 
                :src="post.user?.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'" 
                :alt="post.user?.prenom || 'Utilisateur'"
                class="user-avatar"
                style="border-radius: 50% !important; width: 40px; height: 40px; object-fit: cover;"
              />
              <div class="flex-1">
                <div class="flex items-center space-x-2">
                  <h4 class="font-medium text-gray-900 text-sm">
                    {{ post.user?.prenom }} {{ post.user?.nom }}
                  </h4>
                  <span class="text-xs text-gray-500">{{ formatDate(post.created_at) }}</span>
                </div>
                <p class="text-gray-800 text-sm leading-relaxed mt-1">{{ post.content }}</p>
              </div>
            </div>
            
            <!-- Image du post si présente -->
            <div v-if="post.image" class="mt-3">
              <img 
                :src="post.image" 
                alt="Image du post"
                class="w-full rounded-lg object-cover max-h-48"
              />
            </div>
          </div>
        </div>

        <!-- Liste des commentaires -->
        <div class="bg-white">
          <div v-if="comments.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun commentaire</h3>
            <p class="mt-1 text-sm text-gray-500">Soyez le premier à commenter ce post!</p>
          </div>

          <div v-else class="divide-y divide-gray-100">
            <TransitionGroup name="comment" tag="div">
              <CommentCard
                v-for="comment in comments" 
                :key="comment.id"
                :comment="comment"
                :current-user-id="currentUserId"
                @like="handleCommentLike"
                @reply="replyToComment"
                @delete="deleteComment"
              />
            </TransitionGroup>
          </div>
        </div>
      </div>
    </main>

    <!-- Zone de saisie de commentaire (fixe en bas) -->
    <div class="comment-input-container">
      <div class="comments-container">
        <div class="flex items-start space-x-3">
          <img 
            :src="user?.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'" 
            :alt="user?.prenom || 'Utilisateur'"
            class="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
            style="border-radius: 50% !important;"
          />
          <div class="flex-1">
            <textarea 
              v-model="newComment"
              placeholder="Écrivez votre commentaire..."
              rows="1"
              maxlength="500"
              class="comment-textarea"
              @input="adjustTextareaHeight"
              @keydown.enter.prevent="submitComment"
              ref="commentTextarea"
            ></textarea>
            <div class="flex justify-between items-center mt-2">
              <span class="comment-counter">
                {{ newComment.length }}/500 caractères
              </span>
              <button 
                @click="submitComment"
                :disabled="!newComment.trim() || isSubmitting"
                class="comment-submit-btn"
              >
                {{ isSubmitting ? 'Envoi...' : 'Commenter' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const { user } = useAuth()

// États
const post = ref(null)
const comments = ref([])
const newComment = ref('')
const isSubmitting = ref(false)
const currentUserId = computed(() => user.value?.id || 1)

// Données d'exemple
const samplePosts = {
  1: {
    id: 1,
    content: "Belle journée pour développer de nouvelles relations professionnelles ! 🌟 #networking #success",
    created_at: new Date(Date.now() - 30 * 60 * 1000),
    user: {
      id: 2,
      prenom: "Marie",
      nom: "Dubois",
      photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
  },
  2: {
    id: 2,
    content: "J'ai adoré la conférence sur les relations humaines aujourd'hui. Tellement d'apprentissages à partager ! 📚 #formation #development",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
    user: {
      id: 3,
      prenom: "Pierre",
      nom: "Martin",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    image: "https://images.unsplash.com/photo-1559523275-98fb3c56faf6?w=600&h=400&fit=crop"
  }
}

const sampleComments = {
  1: [
    {
      id: 1,
      content: "Tout à fait d'accord ! Le networking est essentiel pour le développement professionnel. Merci pour le partage 👍",
      created_at: new Date(Date.now() - 15 * 60 * 1000),
      is_liked: false,
      likes_count: 3,
      user: {
        id: 3,
        prenom: "Pierre",
        nom: "Martin",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      id: 2,
      content: "Super initiative ! Y a-t-il des événements de networking prévus prochainement dans la région ?",
      created_at: new Date(Date.now() - 10 * 60 * 1000),
      is_liked: true,
      likes_count: 2,
      user: {
        id: 4,
        prenom: "Sophie",
        nom: "Leroy",
        photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      id: 3,
      content: "L'image est magnifique ! Ça donne envie de participer à ce genre d'événements 😊",
      created_at: new Date(Date.now() - 5 * 60 * 1000),
      is_liked: false,
      likes_count: 1,
      user: {
        id: 6,
        prenom: "Camille",
        nom: "Moreau",
        photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
      }
    }
  ],
  2: [
    {
      id: 4,
      content: "Cette conférence était formidable ! Les intervenants étaient vraiment inspirants. As-tu pris des notes que tu pourrais partager ?",
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000),
      is_liked: true,
      likes_count: 5,
      user: {
        id: 2,
        prenom: "Marie",
        nom: "Dubois",
        photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      id: 5,
      content: "Je regrette d'avoir raté cet événement. Y aura-t-il un replay ou des supports disponibles ?",
      created_at: new Date(Date.now() - 30 * 60 * 1000),
      is_liked: false,
      likes_count: 2,
      user: {
        id: 7,
        prenom: "Antoine",
        nom: "Lefebvre",
        photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
      }
    }
  ]
}

// Méthodes
const goBack = () => {
  router.back()
}

const formatDate = (date) => {
  const now = new Date()
  const commentDate = new Date(date)
  const diff = now - commentDate
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return 'À l\'instant'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}j`
  
  return commentDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  })
}

const submitComment = async () => {
  if (!newComment.value.trim() || isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    const comment = {
      id: Date.now(),
      content: newComment.value.trim(),
      created_at: new Date(),
      is_liked: false,
      likes_count: 0,
      user: {
        id: currentUserId.value,
        prenom: user.value?.prenom || 'Vous',
        nom: user.value?.nom || '',
        photo: user.value?.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      }
    }
    
    comments.value.push(comment)
    newComment.value = ''
    
    // Réinitialiser la hauteur du textarea
    nextTick(() => {
      const textarea = document.querySelector('textarea')
      if (textarea) {
        textarea.style.height = 'auto'
      }
    })
    
    console.log('Commentaire ajouté:', comment)
    
  } catch (error) {
    console.error('Erreur lors de l\'ajout du commentaire:', error)
  } finally {
    isSubmitting.value = false
  }
}

const adjustTextareaHeight = (event) => {
  const textarea = event.target
  textarea.style.height = 'auto'
  textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
}

const handleCommentLike = (data) => {
  console.log('Comment like toggled:', data.commentId, data.isLiked)
  const comment = comments.value.find(c => c.id === data.commentId)
  if (comment) {
    comment.is_liked = data.isLiked
    comment.likes_count += data.isLiked ? 1 : -1
  }
}

const replyToComment = (comment) => {
  newComment.value = `@${comment.user.prenom} `
  nextTick(() => {
    const textarea = document.querySelector('textarea')
    if (textarea) {
      textarea.focus()
      textarea.setSelectionRange(textarea.value.length, textarea.value.length)
    }
  })
}

const deleteComment = (commentId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
    comments.value = comments.value.filter(c => c.id !== commentId)
    console.log('Commentaire supprimé:', commentId)
  }
}

// Initialisation
onMounted(() => {
  const postId = parseInt(route.params.id)
  post.value = samplePosts[postId] || null
  comments.value = sampleComments[postId] || []
  
  if (!post.value) {
    // Rediriger vers le dashboard si le post n'existe pas
    router.push('/dashboard')
  }
})

// SEO
useSeoMeta({
  title: 'Commentaires - Ressources Relationnelles',
  description: 'Commentaires et échanges sur le post'
})
</script> 