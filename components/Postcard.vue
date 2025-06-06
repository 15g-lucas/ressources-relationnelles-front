<template>
  <div class="max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden relative border border-black m-4">
    <div class="p-4 bg-white border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <img :src="image" alt="Profile Image" class="w-12 h-12 rounded-full object-cover">
          <div class="ml-3">
            <div class="font-bold">{{ name }}</div>
            <div class="text-gray-600 text-sm">@{{ pseudo }}</div>
          </div>
        </div>
        <div class="text-gray-500 text-sm">{{ displayTime }}</div>
      </div>
    </div>
    <div class="p-4 bg-white mb-12">
      <p class="text-gray-700 mb-4">{{ text }}</p>
      <div v-if="contentImages && contentImages.length > 0" class="grid grid-cols-1 gap-4">
        <img v-for="(img, index) in contentImages" :key="index" :src="img" alt="Content Image" class="w-full h-auto rounded-lg">
      </div>
    </div>
    <div class="absolute bottom-0 right-0 p-4 flex space-x-2 bg-white">
      <button class="text-gray-500 hover:text-blue-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>
      <button class="text-gray-500 hover:text-blue-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
      <button class="text-gray-500 hover:text-blue-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
      <button class="text-gray-500 hover:text-blue-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    image: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    pseudo: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: false
    },
    contentImages: {
      type: Array,
      required: false,
      default: () => []
    },
    publishedAt: {
      type: String,
      required: true
    }
  },
  computed: {
    displayTime() {
      const publishedDate = new Date(this.publishedAt);
      return this.timeSince(publishedDate);
    }
  },
  methods: {
    timeSince(date) {
      const seconds = Math.floor((new Date() - date) / 1000);

      let interval = Math.floor(seconds / 31536000);
      if (interval >= 1) {
        return `${interval}an`;
      }

      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) {
        return `${interval}m`;
      }

      interval = Math.floor(seconds / 86400);
      if (interval >= 1) {
        return `${interval}j`;
      }

      interval = Math.floor(seconds / 3600);
      if (interval >= 1) {
        return `${interval}h`;
      }

      interval = Math.floor(seconds / 60);
      if (interval >= 1) {
        return `${interval}min`;
      }

      return `${seconds}s`;
    }
  }
}
</script>
