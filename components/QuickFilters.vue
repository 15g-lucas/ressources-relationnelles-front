<template>
  <div class="bg-white p-4 border-b border-gray-200">
    <h3 class="text-sm font-medium text-gray-700 mb-3">Filtres rapides</h3>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="filter in quickFilters"
        :key="filter.id"
        @click="$emit('apply', filter)"
        class="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
      >
        <span :class="filter.iconClass">{{ filter.icon }}</span>
        <span>{{ filter.label }}</span>
        <span class="bg-gray-300 text-gray-700 px-1 rounded-full text-xs">{{ filter.count }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  resourcesCount: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['apply'])

const quickFilters = computed(() => [
  {
    id: 'recent',
    label: 'Récent',
    icon: '🆕',
    iconClass: '',
    count: props.resourcesCount.recent || 0,
    filters: { sortBy: 'date_desc' }
  },
  {
    id: 'popular',
    label: 'Populaire',
    icon: '🔥',
    iconClass: '',
    count: props.resourcesCount.popular || 0,
    filters: { sortBy: 'popularity' }
  },
  {
    id: 'formation',
    label: 'Formations',
    icon: '📚',
    iconClass: '',
    count: props.resourcesCount.formation || 0,
    filters: { category: ['formation'] }
  },
  {
    id: 'networking',
    label: 'Networking',
    icon: '🤝',
    iconClass: '',
    count: props.resourcesCount.networking || 0,
    filters: { category: ['networking'] }
  },
  {
    id: 'events',
    label: 'Événements',
    icon: '📅',
    iconClass: '',
    count: props.resourcesCount.events || 0,
    filters: { resourceType: ['evenement'] }
  },
  {
    id: 'favorited',
    label: 'Favoris',
    icon: '⭐',
    iconClass: '',
    count: props.resourcesCount.favorited || 0,
    filters: { favorited: true }
  }
])
</script> 