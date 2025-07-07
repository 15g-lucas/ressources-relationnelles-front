<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4">
            <NuxtLink to="/dashboard" class="text-indigo-600 hover:text-indigo-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </NuxtLink>
            <h1 class="text-2xl font-bold text-gray-900">Administration</h1>
            <span class="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">ADMIN</span>
          </div>
          <div class="flex items-center space-x-4">
            <!-- Navigation tabs -->
            <div class="flex bg-gray-100 rounded-lg p-1">
              <button
                @click="activeTab = 'users'"
                :class="[
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  activeTab === 'users' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                ]"
              >
                Utilisateurs
              </button>
              <button
                @click="activeTab = 'moderation'"
                :class="[
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2',
                  activeTab === 'moderation' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                ]"
              >
                <span>Modération</span>
                <span v-if="moderationStats?.pending > 0" class="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {{ moderationStats.pending }}
                </span>
              </button>
            </div>
            <span class="text-sm text-gray-600">{{ user?.prenom }} {{ user?.nom }}</span>
            <button
              @click="logout"
              class="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Messages d'état -->
      <div v-if="successMessage" class="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
        {{ successMessage }}
      </div>
      
      <div v-if="errorMessage" class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {{ errorMessage }}
      </div>

      <!-- Onglet Utilisateurs -->
      <div v-if="activeTab === 'users'">
        <!-- Statistiques utilisateurs -->
        <div v-if="stats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Total utilisateurs</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.total }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Comptes actifs</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.active }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Comptes inactifs</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.inactive + stats.suspended }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Nouveaux (7j)</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.newThisWeek }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Filtres utilisateurs -->
        <div class="bg-white rounded-lg shadow mb-6 p-4">
          <div class="flex flex-wrap items-center space-x-4">
            <div class="flex items-center space-x-2">
              <label class="text-sm font-medium text-gray-700">Statut:</label>
              <select 
                v-model="statusFilter"
                @change="applyFilters"
                class="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Tous</option>
                <option value="active">Actifs</option>
                <option value="inactive">Inactifs</option>
                <option value="suspended">Suspendus</option>
              </select>
            </div>
            
            <div class="flex items-center space-x-2">
              <label class="text-sm font-medium text-gray-700">Rôle:</label>
              <select 
                v-model="roleFilter"
                @change="applyFilters"
                class="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Tous</option>
                <option value="user">Utilisateurs</option>
                <option value="admin">Administrateurs</option>
              </select>
            </div>

            <div class="flex items-center space-x-2">
              <input 
                v-model="searchQuery"
                @input="applyFilters"
                type="text"
                placeholder="Rechercher par nom ou email..."
                class="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
              />
            </div>

            <button 
              @click="refreshData"
              :disabled="isLoading"
              class="bg-indigo-600 text-white px-4 py-1 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Actualiser
            </button>
          </div>
        </div>

        <!-- Tableau des utilisateurs -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              Gestion des utilisateurs ({{ filteredUsers.length }} résultats)
            </h3>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dernière connexion
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statistiques
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="userItem in filteredUsers" :key="userItem.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <img 
                            :src="userItem.photo" 
                            :alt="userItem.prenom"
                            class="h-10 w-10 rounded-full object-cover"
                            @error="handleImageError"
                          />
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">
                            {{ userItem.prenom }} {{ userItem.nom }}
                          </div>
                          <div class="text-sm text-gray-500">
                            {{ userItem.email }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="[
                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                        userItem.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      ]">
                        {{ userItem.role === 'admin' ? 'Administrateur' : 'Utilisateur' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="[
                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                        getStatusColor(userItem.status)
                      ]">
                        {{ getStatusLabel(userItem.status) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatLastLogin(userItem.last_login) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div class="space-y-1">
                        <div>{{ userItem.posts_count || 0 }} posts</div>
                        <div>{{ userItem.connections_count || 0 }} relations</div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <!-- Actions selon le statut -->
                      <button 
                        v-if="userItem.status === 'active'"
                        @click="updateStatus(userItem.id, 'inactive')"
                        :disabled="isUpdatingStatus"
                        class="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 disabled:opacity-50"
                      >
                        Désactiver
                      </button>
                      
                      <button 
                        v-if="userItem.status === 'inactive' || userItem.status === 'suspended'"
                        @click="updateStatus(userItem.id, 'active')"
                        :disabled="isUpdatingStatus"
                        class="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
                      >
                        Activer
                      </button>
                      
                      <button 
                        v-if="userItem.status !== 'suspended'"
                        @click="updateStatus(userItem.id, 'suspended')"
                        :disabled="isUpdatingStatus"
                        class="bg-orange-600 text-white px-3 py-1 rounded text-xs hover:bg-orange-700 disabled:opacity-50"
                      >
                        Suspendre
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- État vide -->
            <div v-if="filteredUsers.length === 0 && !isLoading" class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun utilisateur trouvé</h3>
              <p class="mt-1 text-sm text-gray-500">Essayez de modifier vos filtres de recherche.</p>
            </div>

            <!-- Chargement -->
            <div v-if="isLoading" class="text-center py-12">
              <svg class="animate-spin mx-auto h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="text-gray-500 mt-2">Chargement des données...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Onglet Modération -->
      <div v-if="activeTab === 'moderation'">
        <!-- Statistiques modération -->
        <div v-if="moderationStats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Total ressources</p>
                <p class="text-2xl font-semibold text-gray-900">{{ moderationStats.total }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">En attente</p>
                <p class="text-2xl font-semibold text-gray-900">{{ moderationStats.pending }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Approuvées</p>
                <p class="text-2xl font-semibold text-gray-900">{{ moderationStats.approved }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Rejetées</p>
                <p class="text-2xl font-semibold text-gray-900">{{ moderationStats.rejected }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Brouillons</p>
                <p class="text-2xl font-semibold text-gray-900">{{ moderationStats.draft }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Filtres modération -->
        <div class="bg-white rounded-lg shadow mb-6 p-4">
          <div class="flex flex-wrap items-center space-x-4">
            <div class="flex items-center space-x-2">
              <label class="text-sm font-medium text-gray-700">Statut:</label>
              <select 
                v-model="resourceStatusFilter"
                @change="applyResourceFilters"
                class="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Tous</option>
                <option value="pending">En attente</option>
                <option value="approved">Approuvées</option>
                <option value="rejected">Rejetées</option>
                <option value="draft">Brouillons</option>
              </select>
            </div>
            
            <div class="flex items-center space-x-2">
              <label class="text-sm font-medium text-gray-700">Type:</label>
              <select 
                v-model="resourceTypeFilter"
                @change="applyResourceFilters"
                class="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Tous</option>
                <option value="article">Article</option>
                <option value="evenement">Événement</option>
                <option value="contact">Contact</option>
                <option value="formation">Formation</option>
                <option value="outil">Outil</option>
                <option value="video">Vidéo</option>
                <option value="livre">Livre</option>
                <option value="podcast">Podcast</option>
              </select>
            </div>

            <div class="flex items-center space-x-2">
              <input 
                v-model="resourceSearchQuery"
                @input="applyResourceFilters"
                type="text"
                placeholder="Rechercher par titre ou auteur..."
                class="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
              />
            </div>

            <button 
              @click="refreshModerationData"
              :disabled="isModerationLoading"
              class="bg-indigo-600 text-white px-4 py-1 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              <svg v-if="isModerationLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Actualiser
            </button>
          </div>
        </div>

        <!-- Liste des ressources à modérer -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              Ressources à modérer ({{ filteredResources.length }} résultats)
            </h3>
            
            <div class="space-y-4">
              <div 
                v-for="resource in filteredResources" 
                :key="resource.id"
                class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div class="flex items-start space-x-4">
                  <!-- Image -->
                  <div class="flex-shrink-0">
                    <img 
                      :src="resource.image || 'https://picsum.photos/120/80?random=' + resource.id"
                      :alt="resource.title"
                      class="w-20 h-16 object-cover rounded-lg"
                      @error="handleResourceImageError"
                    />
                  </div>

                  <!-- Contenu -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between">
                      <div class="flex-1">
                        <h4 class="text-lg font-medium text-gray-900 truncate">{{ resource.title }}</h4>
                        <p class="text-sm text-gray-600 mt-1">{{ resource.description }}</p>
                        <div class="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>Par {{ resource.author }}</span>
                          <span>{{ formatDate(resource.submittedAt) }}</span>
                          <span class="capitalize">{{ resource.category }}</span>
                          <span class="capitalize">{{ resource.resourceType }}</span>
                        </div>
                        <div v-if="resource.tags && resource.tags.length" class="flex flex-wrap gap-1 mt-2">
                          <span 
                            v-for="tag in resource.tags" 
                            :key="tag"
                            class="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                          >
                            {{ tag }}
                          </span>
                        </div>
                      </div>

                      <!-- Statut et actions -->
                      <div class="flex flex-col items-end space-y-2 ml-4">
                        <span :class="[
                          'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                          getResourceStatusColor(resource.status)
                        ]">
                          {{ getResourceStatusLabel(resource.status) }}
                        </span>

                        <div v-if="resource.status === 'pending'" class="flex space-x-2">
                          <button 
                            @click="showModerationModal(resource, 'approve')"
                            :disabled="isModerating"
                            class="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
                          >
                            Approuver
                          </button>
                          <button 
                            @click="showModerationModal(resource, 'reject')"
                            :disabled="isModerating"
                            class="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 disabled:opacity-50"
                          >
                            Rejeter
                          </button>
                        </div>

                        <div v-if="resource.moderatedAt && resource.moderationNote" class="text-xs text-gray-500 max-w-48">
                          <p class="font-medium">Note de modération:</p>
                          <p class="italic">{{ resource.moderationNote }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- État vide -->
            <div v-if="filteredResources.length === 0 && !isModerationLoading" class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune ressource trouvée</h3>
              <p class="mt-1 text-sm text-gray-500">Essayez de modifier vos filtres de recherche.</p>
            </div>

            <!-- Chargement -->
            <div v-if="isModerationLoading" class="text-center py-12">
              <svg class="animate-spin mx-auto h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="text-gray-500 mt-2">Chargement des ressources...</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de modération -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeModal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ modalAction === 'approve' ? 'Approuver' : 'Rejeter' }} la ressource
          </h3>
          <p class="text-sm text-gray-600 mb-4">
            {{ modalAction === 'approve' 
              ? 'Cette ressource sera publiée et visible par tous les utilisateurs.'
              : 'Cette ressource sera rejetée et ne sera pas publiée.'
            }}
          </p>
          
          <div v-if="modalAction === 'reject'" class="mb-4">
            <label for="moderationNote" class="block text-sm font-medium text-gray-700 mb-2">
              Raison du rejet (optionnel)
            </label>
            <textarea
              id="moderationNote"
              v-model="moderationNote"
              rows="3"
              class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Expliquez pourquoi cette ressource est rejetée..."
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3">
            <button 
              @click="closeModal"
              class="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-400"
            >
              Annuler
            </button>
            <button 
              @click="confirmModeration"
              :disabled="isModerating"
              :class="[
                'px-4 py-2 rounded text-sm text-white font-medium disabled:opacity-50',
                modalAction === 'approve' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              ]"
            >
              <svg v-if="isModerating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ modalAction === 'approve' ? 'Approuver' : 'Rejeter' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Vérification admin seulement
definePageMeta({
  middleware: 'admin'
})

const { user, logout, getAllUsers, updateUserStatus, getUserStats, getAllResources, moderateResource, getModerationStats } = useAuth()

// Redirection si pas admin
if (process.client && user.value && user.value.role !== 'admin') {
  await navigateTo('/dashboard')
}

// États réactifs - Général
const activeTab = ref('users')
const successMessage = ref('')
const errorMessage = ref('')

// États réactifs - Utilisateurs
const users = ref([])
const stats = ref(null)
const isLoading = ref(false)
const isUpdatingStatus = ref(false)

// Filtres utilisateurs
const statusFilter = ref('')
const roleFilter = ref('')
const searchQuery = ref('')

// États réactifs - Modération
const resources = ref([])
const moderationStats = ref(null)
const isModerationLoading = ref(false)
const isModerating = ref(false)

// Filtres ressources
const resourceStatusFilter = ref('')
const resourceTypeFilter = ref('')
const resourceSearchQuery = ref('')

// Modal de modération
const showModal = ref(false)
const modalResource = ref(null)
const modalAction = ref('')
const moderationNote = ref('')

// Computed - Utilisateurs
const filteredUsers = computed(() => {
  let filtered = users.value

  // Filtre par statut
  if (statusFilter.value) {
    filtered = filtered.filter(u => u.status === statusFilter.value)
  }

  // Filtre par rôle
  if (roleFilter.value) {
    filtered = filtered.filter(u => u.role === roleFilter.value)
  }

  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(u => 
      u.prenom.toLowerCase().includes(query) ||
      u.nom.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Computed - Ressources
const filteredResources = computed(() => {
  let filtered = resources.value

  // Filtre par statut
  if (resourceStatusFilter.value) {
    filtered = filtered.filter(r => r.status === resourceStatusFilter.value)
  }

  // Filtre par type
  if (resourceTypeFilter.value) {
    filtered = filtered.filter(r => r.resourceType === resourceTypeFilter.value)
  }

  // Filtre par recherche
  if (resourceSearchQuery.value) {
    const query = resourceSearchQuery.value.toLowerCase()
    filtered = filtered.filter(r => 
      r.title.toLowerCase().includes(query) ||
      r.author.toLowerCase().includes(query) ||
      r.description.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Méthodes - Utilisateurs
const loadData = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    // Charger les utilisateurs
    const usersResult = await getAllUsers()
    if (usersResult.success) {
      users.value = usersResult.data
    } else {
      errorMessage.value = usersResult.message
    }

    // Charger les statistiques
    const statsResult = await getUserStats()
    if (statsResult.success) {
      stats.value = statsResult.data
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors du chargement des données'
  } finally {
    isLoading.value = false
  }
}

const updateStatus = async (userId, newStatus) => {
  isUpdatingStatus.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const result = await updateUserStatus(userId, newStatus)
    if (result.success) {
      successMessage.value = result.message
      
      // Mettre à jour localement
      const userIndex = users.value.findIndex(u => u.id === userId)
      if (userIndex !== -1) {
        users.value[userIndex].status = newStatus
      }

      // Recharger les stats
      const statsResult = await getUserStats()
      if (statsResult.success) {
        stats.value = statsResult.data
      }
    } else {
      errorMessage.value = result.message
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors de la mise à jour du statut'
  } finally {
    isUpdatingStatus.value = false
  }
}

// Méthodes - Modération
const loadModerationData = async () => {
  isModerationLoading.value = true
  errorMessage.value = ''

  try {
    // Charger toutes les ressources
    const resourcesResult = await getAllResources(true)
    if (resourcesResult.success) {
      resources.value = resourcesResult.data
    } else {
      errorMessage.value = resourcesResult.message
    }

    // Charger les statistiques de modération
    const moderationStatsResult = await getModerationStats()
    if (moderationStatsResult.success) {
      moderationStats.value = moderationStatsResult.data
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors du chargement des données de modération'
  } finally {
    isModerationLoading.value = false
  }
}

const showModerationModal = (resource, action) => {
  modalResource.value = resource
  modalAction.value = action
  moderationNote.value = ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  modalResource.value = null
  modalAction.value = ''
  moderationNote.value = ''
}

const confirmModeration = async () => {
  if (!modalResource.value || !modalAction.value) return

  isModerating.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const result = await moderateResource(
      modalResource.value.id, 
      modalAction.value, 
      moderationNote.value
    )
    
    if (result.success) {
      successMessage.value = result.message
      
      // Mettre à jour localement
      const resourceIndex = resources.value.findIndex(r => r.id === modalResource.value.id)
      if (resourceIndex !== -1) {
        resources.value[resourceIndex].status = result.data.status
        resources.value[resourceIndex].moderatedAt = new Date()
        resources.value[resourceIndex].moderatedBy = user.value.id
        resources.value[resourceIndex].moderationNote = moderationNote.value
      }

      // Recharger les stats de modération
      const moderationStatsResult = await getModerationStats()
      if (moderationStatsResult.success) {
        moderationStats.value = moderationStatsResult.data
      }

      closeModal()
    } else {
      errorMessage.value = result.message
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors de la modération de la ressource'
  } finally {
    isModerating.value = false
  }
}

// Méthodes générales
const refreshData = () => {
  if (activeTab.value === 'users') {
    loadData()
  } else if (activeTab.value === 'moderation') {
    loadModerationData()
  }
}

const refreshModerationData = () => {
  loadModerationData()
}

const applyFilters = () => {
  // Les filtres sont automatiquement appliqués via le computed
}

const applyResourceFilters = () => {
  // Les filtres sont automatiquement appliqués via le computed
}

// Fonctions utilitaires - Utilisateurs
const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'inactive':
      return 'bg-gray-100 text-gray-800'
    case 'suspended':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'active':
      return 'Actif'
    case 'inactive':
      return 'Inactif'
    case 'suspended':
      return 'Suspendu'
    default:
      return 'Inconnu'
  }
}

const formatLastLogin = (date) => {
  if (!date) return 'Jamais'
  
  const now = new Date()
  const loginDate = new Date(date)
  const diff = now - loginDate
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))
  
  if (minutes < 1) return 'À l\'instant'
  if (minutes < 60) return `${minutes} min`
  if (hours < 24) return `${hours} h`
  if (days < 7) return `${days} j`
  
  return loginDate.toLocaleDateString('fr-FR')
}

// Fonctions utilitaires - Ressources
const getResourceStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-orange-100 text-orange-800'
    case 'approved':
      return 'bg-green-100 text-green-800'
    case 'rejected':
      return 'bg-red-100 text-red-800'
    case 'draft':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getResourceStatusLabel = (status) => {
  switch (status) {
    case 'pending':
      return 'En attente'
    case 'approved':
      return 'Approuvée'
    case 'rejected':
      return 'Rejetée'
    case 'draft':
      return 'Brouillon'
    default:
      return 'Inconnu'
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  
  const now = new Date()
  const targetDate = new Date(date)
  const diff = now - targetDate
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))
  
  if (minutes < 1) return 'À l\'instant'
  if (minutes < 60) return `${minutes} min`
  if (hours < 24) return `${hours} h`
  if (days < 7) return `${days} j`
  
  return targetDate.toLocaleDateString('fr-FR')
}

const handleImageError = (event) => {
  event.target.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default&backgroundColor=e5e7eb'
}

const handleResourceImageError = (event) => {
  event.target.src = 'https://picsum.photos/120/80?random=fallback'
}

// Watchers pour charger les données selon l'onglet actif
watch(activeTab, (newTab) => {
  if (newTab === 'users' && users.value.length === 0) {
    loadData()
  } else if (newTab === 'moderation' && resources.value.length === 0) {
    loadModerationData()
  }
}, { immediate: false })

// Charger les données au montage
onMounted(() => {
  // Vérifier encore une fois si l'utilisateur est admin
  if (!user.value || user.value.role !== 'admin') {
    navigateTo('/dashboard')
    return
  }
  
  // Charger les données de l'onglet par défaut (users)
  loadData()
  
  // Charger aussi les stats de modération pour le badge
  loadModerationData()
})

// SEO
useSeoMeta({
  title: 'Administration - Gestion des utilisateurs et modération',
  description: 'Panel d\'administration pour gérer les comptes utilisateurs et modérer les ressources'
})
</script> 