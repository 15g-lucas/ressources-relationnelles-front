<template>
  <div class="border-b border-gray-200 bg-white">
    <div class="p-4">
      <div class="flex space-x-3">
        <img :src="comment.image" alt="Commenter" class="w-10 h-10 rounded-full object-cover">
        <div class="flex-1">
          <div class="flex items-center space-x-2 mb-1">
            <span class="font-semibold text-gray-900 text-sm">{{ comment.name }}</span>
            <span class="text-gray-500 text-sm">@{{ comment.pseudo }}</span>
            <span class="text-gray-500 text-sm">·</span>
            <span class="text-gray-500 text-sm">{{ timeSince(new Date(comment.publishedAt)) }}</span>
          </div>
          
          <p class="text-gray-800 text-sm leading-relaxed mb-2">{{ comment.text }}</p>
          
          <div class="flex items-center space-x-4">
            <button
              @click="toggleReplyForm"
              class="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              <span>Répondre</span>
            </button>
            
            <button
              v-if="comment.replies && comment.replies.length > 0"
              @click="toggleReplies"
              class="text-blue-500 hover:text-blue-600 text-sm font-medium"
            >
              {{ showReplies ? 'Masquer' : 'Voir' }} {{ comment.replies.length }} réponse{{ comment.replies.length > 1 ? 's' : '' }}
            </button>
          </div>

          <!-- Formulaire de réponse -->
          <div v-if="showReplyForm" class="mt-3 pl-2 border-l-2 border-blue-200">
            <div class="flex space-x-2">
              <img 
                src="https://randomuser.me/api/portraits/lego/1.jpg" 
                alt="Your avatar" 
                class="w-8 h-8 rounded-full object-cover" 
              >
              <div class="flex-1">
                <textarea
                  v-model="replyText"
                  :placeholder="`Répondre à @${comment.pseudo}...`"
                  class="w-full p-2 border border-gray-300 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                ></textarea>
                <div class="flex justify-end space-x-2 mt-2">
                  <button
                    @click="cancelReply"
                    class="px-3 py-1 text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Annuler
                  </button>
                  <button
                    @click="submitReply"
                    :disabled="!replyText.trim()"
                    class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Répondre
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Affichage des réponses -->
          <div v-if="showReplies && comment.replies && comment.replies.length > 0" class="mt-3 pl-4 border-l-2 border-gray-200 space-y-3">
            <div v-for="reply in comment.replies" :key="reply.id" class="flex space-x-2">
              <img :src="reply.image" alt="Replier" class="w-8 h-8 rounded-full object-cover">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-1">
                  <span class="font-semibold text-gray-900 text-sm">{{ reply.name }}</span>
                  <span class="text-gray-500 text-sm">@{{ reply.pseudo }}</span>
                  <span class="text-gray-500 text-sm">·</span>
                  <span class="text-gray-500 text-sm">{{ timeSince(new Date(reply.publishedAt)) }}</span>
                </div>
                <p class="text-gray-800 text-sm leading-relaxed">{{ reply.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Comment',
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showReplyForm: false,
      replyText: '',
      showReplies: false
    }
  },
  methods: {
    timeSince(date) {
      const seconds = Math.floor((new Date() - date) / 1000);
      
      let interval = Math.floor(seconds / 31536000);
      if (interval >= 1) return `${interval}an`;
      
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) return `${interval}m`;
      
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) return `${interval}j`;
      
      interval = Math.floor(seconds / 3600);
      if (interval >= 1) return `${interval}h`;
      
      interval = Math.floor(seconds / 60);
      if (interval >= 1) return `${interval}min`;
      
      return `${seconds}s`;
    },
    toggleReplyForm() {
      this.showReplyForm = !this.showReplyForm;
    },
    toggleReplies() {
      this.showReplies = !this.showReplies;
    },
    submitReply() {
      if (this.replyText.trim()) {
        this.$emit('add-reply', this.comment.id, this.replyText);
        this.replyText = '';
        this.showReplyForm = false;
        this.showReplies = true;
      }
    },
    cancelReply() {
      this.showReplyForm = false;
      this.replyText = '';
    }
  }
}
</script>